
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api, yeshteryApi, localApi } from '@/lib/utils';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ShopCheckInLogin = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'login' | 'checkin'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', isEmployee: false, orgId: 2 });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const shopIdParam = searchParams.get('shopId');
  const [shopId] = useState(shopIdParam ? shopIdParam.toString() : '');
  const [checkinForm, setCheckinForm] = useState({ shopId: shopIdParam || '', latitude: '', longitude: '' });
  const { login } = useAuth();
  const { user } = useAuth();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [currentShop, setCurrentShop] = useState<any>(null);

  // On mount, login as admin and save token
  useEffect(() => {
    const loginAsAdmin = async () => {
      try {
        const adminLoginRes = await api.post(
          yeshteryApi + 'yeshtery/token',
          {
            email: 'development@dechains.com',
            password: 'dev@dechains123',
            orgId: '2',
            isEmployee: true
          },
          { headers: { 'Content-Type': 'application/json', 'X-Skip-401-Interceptor': 'true' } }
        );
        const adminJwt = adminLoginRes.data?.token || adminLoginRes.data?.accessToken;
        if (adminJwt) setAdminToken(adminJwt);
      } catch (err) {
        // Optionally toast or log error
      }
    };
    loginAsAdmin();
  }, []);

  // Fetch shops and set currentShop when adminToken and step are ready
  useEffect(() => {
    if (step !== 'checkin' || !adminToken || !shopId) return;
    const fetchShop = async () => {
      try {
        const shopRes = await api.get(`${yeshteryApi}organization/shops`, {
          headers: { Authorization: `Bearer ${adminToken}`, 'X-Skip-401-Interceptor': 'true' }
        });
        const shopList = shopRes.data.content || shopRes.data;
        const foundShop = shopList.find((s: any) => String(s.id) === String(shopId));
        setCurrentShop(foundShop || null);
      } catch (err) {
        toast({ title: 'Shop Fetch Failed', description: 'Could not fetch shop details.', variant: 'destructive' });
      }
    };
    fetchShop();
  }, [step, adminToken, shopId]);

  // Fetch sub-areas and set lat/long when currentShop is set
  useEffect(() => {
    if (!currentShop || !adminToken) return;
    const areaId = currentShop.address?.area_id;
    if (!areaId) return;
    const fetchSubAreas = async () => {
      try {
        const subAreaRes = await api.get(`${yeshteryApi}organization/sub_areas?area_id=${areaId}`, {
          headers: { Authorization: `Bearer ${adminToken}`, 'X-Skip-401-Interceptor': 'true' },
        });
        const subAreas = subAreaRes.data;
        let lat = '', lng = '';
        if (Array.isArray(subAreas) && subAreas.length > 0) {
          lat = subAreas[0].latitude != null && subAreas[0].latitude !== '' ? subAreas[0].latitude.toString() : checkinForm.latitude;
          lng = subAreas[0].longitude != null && subAreas[0].longitude !== '' ? subAreas[0].longitude.toString() : checkinForm.longitude;
        } else if (currentShop.address) {
          lat = currentShop.address.latitude?.toString() || checkinForm.latitude;
          lng = currentShop.address.longitude?.toString() || checkinForm.longitude;
        }
        setCheckinForm(f => ({ ...f, latitude: lat, longitude: lng }));
      } catch (err) {
        toast({ title: 'Sub Area Fetch Failed', description: 'Could not fetch sub-area location.', variant: 'destructive' });
      }
    };
    fetchSubAreas();
  }, [currentShop, adminToken]);

  // Dummy login for demonstration; replace with real auth if needed
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginForm.email && loginForm.password) {
        login(loginForm, 'user');
        setStep('checkin');
        toast({ title: 'Login successful', description: 'Proceed to check-in.' });
      } else {
        throw new Error('Missing credentials');
      }
    } catch (err) {
      toast({ title: 'Login failed', description: 'Please check your credentials.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { shopId, latitude, longitude } = checkinForm;
      if (!shopId || !latitude || !longitude) throw new Error('All fields required');
      await api.post(
        `${yeshteryApi}shop_check_in/reward?shopId=${shopId}`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${user.token}`, 'X-Skip-401-Interceptor': 'true' } }
      );
      toast({ title: 'Check-in successful!', description: 'Points earned.' });
      setCheckinForm({ shopId: '', latitude: '', longitude: '' });
    } catch (err) {
      if (err?.response?.status === 401) {
        toast({ title: 'Check-in failed', description: 'Shop check-in config for the shop is not found.', variant: 'destructive' });
      } else if (err?.response?.status === 500) {
        const message = err?.response?.data?.message || 'Internal server error.';
        toast({ title: 'Check-in failed', description: message, variant: 'destructive' });
      } else {
        toast({ title: 'Check-in failed', description: 'Please try again.', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <GradientCard>
          <CardHeader className="text-center">
            <CardTitle>Shop Check-In</CardTitle>
            <CardDescription>Login and earn points by checking in at your shop</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="Enter username" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="Enter password" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
              </form>
            )}
            {step === 'checkin' && (
              <form onSubmit={handleCheckIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input id="latitude" value={checkinForm.latitude} onChange={e => setCheckinForm(f => ({ ...f, latitude: e.target.value }))} placeholder="Latitude" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input id="longitude" value={checkinForm.longitude} onChange={e => setCheckinForm(f => ({ ...f, longitude: e.target.value }))} placeholder="Longitude" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Checking in...' : 'Check In & Earn Points'}</Button>
              </form>
            )}
          </CardContent>
        </GradientCard>
      </div>
    </div>
  );
};

export default ShopCheckInLogin; 
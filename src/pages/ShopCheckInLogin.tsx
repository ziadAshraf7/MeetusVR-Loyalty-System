
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { yeshteryApi } from '@/lib/utils';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = '/shop_check_in/'; // Adjust as needed

export const ShopCheckInLogin = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'login' | 'checkin'>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' , isEmployee : false , orgId : 2 });
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get('shopId');  const [checkinForm, setCheckinForm] = useState({ shopId: shopId, latitude: '29.9759767433654', longitude: '30.9442681318302' });
  const { login } = useAuth();
  const { user, isLoading } = useAuth();


  // Dummy login for demonstration; replace with real auth if needed
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with real login API call
      if (loginForm.email && loginForm.password) {
        login(loginForm , 'user');
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
      console.log(shopId , latitude)
      if (!shopId || !latitude || !longitude) throw new Error('All fields required');
      await axios.post(
        `${yeshteryApi}shop_check_in/reward?shopId=${shopId}`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast({ title: 'Check-in successful!', description: 'Points earned.' });
      setCheckinForm({ shopId: '', latitude: '', longitude: '' });
    } catch (err) {
      toast({ title: 'Check-in failed', description: 'Please try again.', variant: 'destructive' });
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
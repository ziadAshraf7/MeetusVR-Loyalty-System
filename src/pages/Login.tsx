import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User, Shield, Sparkles, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '' , isEmployee : true , orgId : 2  });
  const [userForm, setUserForm] = useState({ email: '', password: '' , isEmployee : false , orgId : 2 });
  const { user, isLoading : userLoading } = useAuth();

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Dashboard login state
  const [dashboardForm, setDashboardForm] = useState({ email: '', password: '' });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const handleSignup = async () => {
    setSignupError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    setSignupLoading(true);
    try {
      await axios.post('https://api.dev.meetusvr.com/user/v2/register', {
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        confirmation_flag: true,
        org_id: 2,
        redirect_url: 'https://www.dev.meetusvr.com/tseppas/activate',
      });
      toast({
        title: 'Signup successful!',
        description: 'Please check your email to activate your account.',
      });
      setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      const message = error?.response?.data?.message || 'Signup failed. Please try again.';
      toast({
        title: 'Signup failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleDashboardLogin = async () => {
    setDashboardLoading(true);
    try {
      await login({
        email: dashboardForm.email,
        password: dashboardForm.password,
        isEmployee: true,
        orgId: 2,
      }, 'admin');
      toast({
        title: 'Dashboard login successful!',
        description: 'You are now logged in as an employee.',
      });
      setDashboardForm({ email: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      toast({
        title: 'Dashboard login failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if(user == null) return;
    
    if(user.role == 'admin') navigate('/admin')
    else navigate('/user-dashboard')
  },[userLoading])

  const handleLogin = async (role: 'admin' | 'user') => {
    setIsLoading(true);
    const credentials = role === 'admin' ? adminForm : userForm;
    
    try {
      await login(credentials, role);
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${role}`,
      });
      navigate(role === 'admin' ? '/admin' : '/user-dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 p-4">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center">
        {/* Centralized Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-gold p-4 rounded-full shadow-2xl border-4 border-white/40 animate-pulse">
              <Sparkles className="h-10 w-10 text-yellow-500 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight" style={{textShadow: '0 4px 24px rgba(0,0,0,0.18)'}}>
            Loyalty Rewards
          </h1>
          <p className="text-lg text-blue-100 font-medium max-w-xl mx-auto drop-shadow-sm">
            Access your rewards and manage your loyalty program
          </p>
        </div>
        {/* Forms Row */}
        <div className="w-full flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="flex-1 min-w-0 flex flex-col items-center">
            <GradientCard className="bg-card border-0 shadow-2xl" glow>
              <CardHeader className="text-center pb-2">
                <CardTitle>
                  <span className="text-3xl md:text-4xl font-extrabold text-primary drop-shadow-lg tracking-tight" style={{textShadow: '0 2px 12px rgba(0,0,0,0.10)'}}><span className="text-cyan-500">Tseppas</span> Login</span>
                </CardTitle>
                <CardDescription>
                  <span className="text-base md:text-lg text-blue-900/80 font-medium block mt-2 mb-2">Sign in or create an account to continue</span>
                </CardDescription>
                <div className="w-16 h-1 mx-auto bg-gradient-to-r from-primary to-accent rounded-full opacity-70 mt-2 mb-1" />
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="user" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="user" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="user" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="Enter your email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-password">Password</Label>
                      <Input
                        id="user-password"
                        type="password"
                        placeholder="Enter your password"
                        value={userForm.password}
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-primary hover:shadow-glow"
                      onClick={() => handleLogin('user')}
                      disabled={isLoading}
                    >
                      <User className="h-4 w-4 mr-2" />
                      {isLoading ? 'Signing in...' : 'Sign in as User'}
                    </Button>
                  </TabsContent>
                  <TabsContent value="admin" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter admin email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Admin Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-gold hover:shadow-glow"
                      onClick={() => handleLogin('admin')}
                      disabled={isLoading}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                    </Button>
                  </TabsContent>
                  <TabsContent value="signup">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your name"
                          value={signupForm.name}
                          onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupForm.email}
                          onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Enter your password"
                          value={signupForm.password}
                          onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          value={signupForm.confirmPassword}
                          onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))}
                          className={signupError ? 'border-red-500' : ''}
                        />
                      </div>
                      {signupError && (
                        <div className="text-red-600 text-sm font-medium text-center">{signupError}</div>
                      )}
                      <Button
                        className="w-full bg-gradient-gold hover:shadow-glow text-lg py-2 mt-2"
                        onClick={handleSignup}
                        disabled={signupLoading}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {signupLoading ? 'Signing up...' : 'Sign Up'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </GradientCard>
          </div>
          {/* Dashboard Login Card */}
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <div className="rounded-xl bg-white/90 shadow-2xl p-8 space-y-6 w-full max-w-md">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-primary mb-1 flex items-center justify-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-600" />
                  Dashboard
                </h2>
                <p className="text-muted-foreground text-sm">Employee dashboard login</p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dashboard-email">Email</Label>
                  <Input
                    id="dashboard-email"
                    type="email"
                    placeholder="Enter your email"
                    value={dashboardForm.email}
                    onChange={e => setDashboardForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-password">Password</Label>
                  <Input
                    id="dashboard-password"
                    type="password"
                    placeholder="Enter your password"
                    value={dashboardForm.password}
                    onChange={e => setDashboardForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:shadow-glow text-lg py-2 mt-2"
                  onClick={handleDashboardLogin}
                  disabled={dashboardLoading}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  {dashboardLoading ? 'Logging in...' : 'Login to Dashboard'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
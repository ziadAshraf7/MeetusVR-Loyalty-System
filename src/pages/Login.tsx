import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, User, Shield, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [userForm, setUserForm] = useState({ email: '', password: '' });

  const handleLogin = async (role: 'admin' | 'user') => {
    setIsLoading(true);
    const credentials = role === 'admin' ? adminForm : userForm;
    
    try {
      await login(credentials, role);
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${role}`,
      });
      navigate(role === 'admin' ? '/admin' : '/dashboard');
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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-gold p-3 rounded-full shadow-glow">
              <Sparkles className="h-8 w-8 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Loyalty Rewards
          </h1>
          <p className="text-primary-foreground/80">
            Access your rewards and manage your loyalty program
          </p>
        </div>

        <GradientCard className="bg-card border-0" glow>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Choose your account type to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Admin
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
            </Tabs>
          </CardContent>
        </GradientCard>
      </div>
    </div>
  );
};
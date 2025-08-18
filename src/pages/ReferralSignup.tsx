import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ReferralSignup = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get('referral');
  const referralId = referralParam && /^\d+$/.test(referralParam) ? referralParam : null;

  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleSignup = async () => {
    setSignupError('');
    if (signupForm.password !== signupForm.confirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    setSignupLoading(true);
    try {
      const baseUrl = 'https://api.dev.meetusvr.com/user/v2/register';
      const url = referralId ? `${baseUrl}?referrer=${encodeURIComponent(referralId)}` : baseUrl;
      await axios.post(url, {
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
    } catch (error: any) {
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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-500 to-blue-300 p-4">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-gold p-3 rounded-full shadow-2xl border-4 border-white/40 animate-pulse">
              <Sparkles className="h-8 w-8 text-yellow-500 drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg tracking-tight" style={{textShadow: '0 4px 24px rgba(0,0,0,0.18)'}}>
            Referral Sign Up
          </h1>
          {referralId && (
            <p className="text-sm text-blue-100 font-medium">Referral applied: ID {referralId}</p>
          )}
        </div>
        <GradientCard className="bg-card border-0 shadow-2xl w-full" glow>
          <CardHeader className="text-center pb-2">
            <CardTitle>
              <span className="text-2xl md:text-3xl font-extrabold text-primary drop-shadow-lg tracking-tight" style={{textShadow: '0 2px 12px rgba(0,0,0,0.10)'}}>
                Create your account
              </span>
            </CardTitle>
            <CardDescription>
              <span className="text-base md:text-lg text-blue-900/80 font-medium block mt-2 mb-2">Join the loyalty program</span>
            </CardDescription>
            <div className="w-16 h-1 mx-auto bg-gradient-to-r from-primary to-accent rounded-full opacity-70 mt-2 mb-1" />
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your name"
                  value={signupForm.name}
                  onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>
              {signupError && (
                <div className="text-red-600 text-sm font-medium text-center">{signupError}</div>
              )}
              <Button
                className="w-full bg-gradient-gold hover:shadow-glow text-lg py-2 mt-2"
                type="submit"
                disabled={signupLoading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {signupLoading ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
        </GradientCard>
      </div>
    </div>
  );
};

export default ReferralSignup;



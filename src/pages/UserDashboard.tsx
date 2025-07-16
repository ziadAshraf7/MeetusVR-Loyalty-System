import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Coins, 
  Send, 
  ShoppingCart, 
  Smartphone, 
  QrCode,
  LogOut,
  Gift,
  Wallet,
  Apple
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoyaltyUserPointsResponse, LoyaltyPointTransactionDTO, SharePointsRequest, CheckoutRewardDto } from '@/types/loyalty';

export const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [userPoints, setUserPoints] = useState<LoyaltyUserPointsResponse>({ points: 1250 });
  const [spendablePoints, setSpendablePoints] = useState<LoyaltyPointTransactionDTO[]>([
    { id: '1', points: 500, transactionDate: '2024-01-15', description: 'Purchase reward' },
    { id: '2', points: 300, transactionDate: '2024-01-20', description: 'Bonus points' },
    { id: '3', points: 450, transactionDate: '2024-01-25', description: 'Referral bonus' }
  ]);
  const [shareForm, setShareForm] = useState<SharePointsRequest>({ orgId: 1, email: '', points: 0 });
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSharePoints = async () => {
    if (!shareForm.email || shareForm.points <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid email and points amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Points shared successfully!",
          description: `${shareForm.points} points sent to ${shareForm.email}`,
        });
        setUserPoints(prev => ({ points: prev.points - shareForm.points }));
        setShareForm({ orgId: 1, email: '', points: 0 });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to share points",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleCheckoutReward = async () => {
    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      toast({
        title: "Invalid order amount",
        description: "Please enter a valid order amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        const rewardPoints = Math.floor(parseFloat(orderAmount) * 0.1); // 10% reward
        setUserPoints(prev => ({ points: prev.points + rewardPoints }));
        toast({
          title: "Order processed!",
          description: `You earned ${rewardPoints} reward points!`,
        });
        setOrderAmount('');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Order processing failed",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleWalletAction = (type: 'apple' | 'google') => {
    toast({
      title: `${type === 'apple' ? 'Apple' : 'Google'} Wallet`,
      description: `Opening ${type === 'apple' ? 'Apple' : 'Google'} Wallet integration...`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.email}
            </h1>
            <p className="text-muted-foreground">Manage your loyalty points and rewards</p>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Points Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Points */}
            <GradientCard gradient="primary" glow>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-foreground">
                  <Coins className="h-5 w-5" />
                  Your Points Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary-foreground mb-2">
                  {userPoints.points.toLocaleString()}
                </div>
                <p className="text-primary-foreground/80">Total available points</p>
              </CardContent>
            </GradientCard>

            {/* Spendable Points History */}
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-accent" />
                  Spendable Points History
                </CardTitle>
                <CardDescription>
                  Your recent point transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {spendablePoints.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-gold">
                      +{transaction.points}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </GradientCard>

            {/* Share Points */}
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Share Points
                </CardTitle>
                <CardDescription>
                  Send points to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Recipient Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={shareForm.email}
                      onChange={(e) => setShareForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points to Share</Label>
                    <Input
                      id="points"
                      type="number"
                      placeholder="100"
                      value={shareForm.points}
                      onChange={(e) => setShareForm(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSharePoints} 
                  disabled={isLoading}
                  className="w-full bg-gradient-primary"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sharing...' : 'Share Points'}
                </Button>
              </CardContent>
            </GradientCard>

            {/* Order Checkout */}
            <GradientCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-success" />
                  Order Checkout Reward
                </CardTitle>
                <CardDescription>
                  Earn points on your purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderAmount">Order Amount ($)</Label>
                  <Input
                    id="orderAmount"
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={orderAmount}
                    onChange={(e) => setOrderAmount(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCheckoutReward} 
                  disabled={isLoading}
                  className="w-full bg-gradient-gold"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isLoading ? 'Processing...' : 'Process Order & Earn Points'}
                </Button>
              </CardContent>
            </GradientCard>
          </div>

          {/* Wallet Section */}
          <div className="space-y-6">
            <GradientCard gradient="gold">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent-foreground">
                  <Wallet className="h-5 w-5" />
                  Loyalty Wallet
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">
                  Add to your mobile wallet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleWalletAction('apple')}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                  size="lg"
                >
                  <Apple className="h-5 w-5 mr-2" />
                  Add to Apple Wallet
                </Button>
                <Button 
                  onClick={() => handleWalletAction('google')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <Smartphone className="h-5 w-5 mr-2" />
                  Add to Google Wallet
                </Button>
                <Separator />
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Scan QR code to access your digital loyalty card
                  </p>
                </div>
              </CardContent>
            </GradientCard>
          </div>
        </div>
      </div>
    </div>
  );
};
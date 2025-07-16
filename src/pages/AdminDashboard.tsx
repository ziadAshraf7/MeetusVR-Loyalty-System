import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  LogOut, 
  Crown, 
  Palette, 
  Upload,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoyaltyTierDTO, OrganizationLoyaltyWalletDto } from '@/types/loyalty';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [tiers, setTiers] = useState<LoyaltyTierDTO[]>([
    {
      id: 1,
      tierName: 'Bronze',
      isActive: true,
      isSpecial: false,
      noOfPurchaseFrom: 1,
      noOfPurchaseTo: 10,
      sellingPrice: 100,
      orgId: 1,
      cashBackPercentage: 5,
      constraints: {},
      operation: 'CREATE'
    },
    {
      id: 2,
      tierName: 'Silver',
      isActive: true,
      isSpecial: false,
      noOfPurchaseFrom: 11,
      noOfPurchaseTo: 25,
      sellingPrice: 250,
      orgId: 1,
      cashBackPercentage: 10,
      constraints: {},
      operation: 'CREATE'
    },
    {
      id: 3,
      tierName: 'Gold',
      isActive: true,
      isSpecial: true,
      noOfPurchaseFrom: 26,
      noOfPurchaseTo: 50,
      sellingPrice: 500,
      orgId: 1,
      cashBackPercentage: 15,
      constraints: {},
      operation: 'CREATE'
    }
  ]);
  
  const [walletForm, setWalletForm] = useState<OrganizationLoyaltyWalletDto>({
    primaryColor: '#4C1D95',
    secondaryColor: '#D97706',
    bgColor: '#F8FAFC'
  });
  
  const [updateForm, setUpdateForm] = useState<OrganizationLoyaltyWalletDto>({
    primaryColor: '#4C1D95',
    secondaryColor: '#D97706',
    bgColor: '#F8FAFC'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateWallet = async () => {
    if (!selectedTier) {
      toast({
        title: "Please select a tier",
        description: "You must select a tier before creating a wallet",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Wallet created successfully!",
          description: `Loyalty wallet created for ${tiers.find(t => t.id.toString() === selectedTier)?.tierName} tier`,
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to create wallet",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleUpdateWallet = async () => {
    if (!selectedTier) {
      toast({
        title: "Please select a tier",
        description: "You must select a tier before updating a wallet",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Wallet updated successfully!",
          description: `Loyalty wallet updated for ${tiers.find(t => t.id.toString() === selectedTier)?.tierName} tier`,
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Failed to update wallet",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    // Mock file upload
    toast({
      title: "File uploaded",
      description: `${field} has been uploaded successfully`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Crown className="h-8 w-8 text-accent" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Manage loyalty wallets and tiers</p>
          </div>
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GradientCard>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-primary p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-muted-foreground">Active Users</p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
          
          <GradientCard>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-gold p-3 rounded-full">
                  <Star className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">247,859</p>
                  <p className="text-muted-foreground">Points Distributed</p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
          
          <GradientCard>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-success p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-muted-foreground">Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </GradientCard>
        </div>

        {/* Tier Selection */}
        <GradientCard className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              Select Tier for Wallet Management
            </CardTitle>
            <CardDescription>
              Choose a tier to create or update loyalty wallet settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier) => (
                    <SelectItem key={tier.id} value={tier.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Badge variant={tier.isSpecial ? "default" : "secondary"}>
                          {tier.tierName}
                        </Badge>
                        <span>{tier.cashBackPercentage}% cashback</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedTier && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  {(() => {
                    const tier = tiers.find(t => t.id.toString() === selectedTier);
                    return tier ? (
                      <>
                        <div>
                          <p className="font-medium">Purchase Range</p>
                          <p className="text-sm text-muted-foreground">
                            {tier.noOfPurchaseFrom} - {tier.noOfPurchaseTo} purchases
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Cashback Rate</p>
                          <p className="text-sm text-muted-foreground">
                            {tier.cashBackPercentage}%
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Status</p>
                          <Badge variant={tier.isActive ? "default" : "secondary"}>
                            {tier.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </CardContent>
        </GradientCard>

        {/* Wallet Management */}
        <GradientCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Loyalty Wallet Customization
            </CardTitle>
            <CardDescription>
              Create or update wallet appearance and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="create">Create New Wallet</TabsTrigger>
                <TabsTrigger value="update">Update Existing</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-primary">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="create-primary"
                        type="color"
                        value={walletForm.primaryColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={walletForm.primaryColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#4C1D95"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-secondary">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="create-secondary"
                        type="color"
                        value={walletForm.secondaryColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={walletForm.secondaryColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#D97706"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="create-bg">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="create-bg"
                        type="color"
                        value={walletForm.bgColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, bgColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={walletForm.bgColor}
                        onChange={(e) => setWalletForm(prev => ({ ...prev, bgColor: e.target.value }))}
                        placeholder="#F8FAFC"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Wallet Icon</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload wallet icon</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Wallet Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload wallet logo</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload cover image</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCreateWallet} 
                  disabled={isLoading || !selectedTier}
                  className="w-full bg-gradient-primary"
                  size="lg"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  {isLoading ? 'Creating...' : 'Create Loyalty Wallet'}
                </Button>
              </TabsContent>

              <TabsContent value="update" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="update-primary">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="update-primary"
                        type="color"
                        value={updateForm.primaryColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={updateForm.primaryColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                        placeholder="#4C1D95"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="update-secondary">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="update-secondary"
                        type="color"
                        value={updateForm.secondaryColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={updateForm.secondaryColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        placeholder="#D97706"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="update-bg">Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="update-bg"
                        type="color"
                        value={updateForm.bgColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, bgColor: e.target.value }))}
                        className="w-16 h-10 p-1 border"
                      />
                      <Input
                        value={updateForm.bgColor}
                        onChange={(e) => setUpdateForm(prev => ({ ...prev, bgColor: e.target.value }))}
                        placeholder="#F8FAFC"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Update Icon</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload new icon</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Update Logo</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload new logo</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Update Cover</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload new cover</p>
                      <Input type="file" className="mt-2" accept="image/*" />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleUpdateWallet} 
                  disabled={isLoading || !selectedTier}
                  className="w-full bg-gradient-gold"
                  size="lg"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isLoading ? 'Updating...' : 'Update Loyalty Wallet'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </GradientCard>
      </div>
    </div>
  );
};
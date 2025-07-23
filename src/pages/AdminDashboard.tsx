import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientCard } from '@/components/ui/gradient-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
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
import { api } from '@/lib/utils';
import { localApi, nasnavApi, yeshteryApi } from '@/lib/utils';
import { waitForDebugger } from 'inspector';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [tiers, setTiers] = useState([]);
  const [activeSection, setActiveSection] = useState('wallet');


  const [walletForm, setWalletForm] = useState<any>({
    primaryColor: '',
    secondaryColor: '',
    bgColor: '' ,
    walletIcon : null ,
    walletCoverImage : null , 
    walletLogo : null
  });
  
  const [updateForm, setUpdateForm] = useState<any>({
    primaryColor: '',
    secondaryColor: '',
    bgColor: '',
    walletIcon : null ,
    walletCoverImage : null , 
    walletLogo : null
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Helper for create button disabled state
  const isCreateDisabled =
    isLoading ||
    !selectedTier ||
    !walletForm.primaryColor ||
    !walletForm.secondaryColor ||
    !walletForm.bgColor ||
    !walletForm.walletIcon ||
    !walletForm.walletLogo ||
    !walletForm.walletCoverImage;

  const handleCreateWallet = async () => {
    if (!selectedTier) {
      setIsLoading(false);
      toast({
        title: "Please select a tier",
        description: "You must select a tier before creating a wallet",
        variant: "destructive",
      });
      return;
    }
    // Validation: require all colors and all images
    if (!walletForm.primaryColor || !walletForm.secondaryColor || !walletForm.bgColor) {
      toast({
        title: "Missing colors",
        description: "Please select all color fields.",
        variant: "destructive",
      });
      return;
    }
    if (!walletForm.walletIcon || !walletForm.walletLogo || !walletForm.walletCoverImage) {
      toast({
        title: "Missing images",
        description: "Please upload all images: icon, logo, and cover image.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("primaryColor", walletForm.primaryColor);
      formData.append("secondaryColor", walletForm.secondaryColor);
      formData.append("bgColor", walletForm.bgColor);
  
      if (walletForm.walletCoverImage) {
        formData.append("walletCoverImage", walletForm.walletCoverImage); 
      }
  
      if (walletForm.walletLogo) {
        formData.append("walletLogo", walletForm.walletLogo); 
      }
  
      if (walletForm.walletIcon) {
        formData.append("walletIcon", walletForm.walletIcon); 
      }

      console.log(formData)
  
      const res = await api.post(
        `${yeshteryApi}organization/loyalty-wallet/tier/${selectedTier}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
  
      console.log(res);
      toast({
        title: "Wallet updated successfully!",
        description: `Loyalty wallet updated for ${tiers.find(t => t.id.toString() === selectedTier)?.tierName} tier`,
      });
    } catch (error) {
      const message = error?.response?.data?.message || "Please try again later";
      toast({
        title: "Failed to create wallet",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getOrgTiers = async () => {
    const res = await api.get(yeshteryApi + 'loyalty/tier/list' , {
      headers: {
        'Authorization': `Bearer ${user.token}`, 
        'Content-Type': 'application/json'
      }
    })

    const result = await res.data
    console.log(result)
    setTiers(result)
  }

  useEffect(() => {
    getOrgTiers()
  },[])

const handleUpdateWallet = async () => {
  if (!selectedTier) {
    toast({
      title: "Please select a tier",
      description: "You must select a tier before updating a wallet",
      variant: "destructive",
    });
    return;
  }
  // hasColor and hasImage are already declared above for the button disabled state, so reuse them here.
  const isUpdateDisabled =
    isLoading ||
    !selectedTier ||
    !(hasColor || hasImage);
  if (!(hasColor || hasImage)) {
    toast({
      title: "Missing fields",
      description: "Please select at least one color or one image to update.",
      variant: "destructive",
    });
    return;
  }
  setIsLoading(true);
  try {
    const formData = new FormData();
    formData.append("primaryColor", updateForm.primaryColor);
    formData.append("secondaryColor", updateForm.secondaryColor);
    formData.append("bgColor", updateForm.bgColor);

    if (updateForm.walletCoverImage) {
      formData.append("walletCoverImage", updateForm.walletCoverImage); 
    }

    if (updateForm.walletLogo) {
      formData.append("walletLogo", updateForm.walletLogo); 
    }

    if (updateForm.walletIcon) {
      formData.append("walletIcon", updateForm.walletIcon); 
    }

    const res = await api.put(
      `${yeshteryApi}organization/loyalty-wallet/tier/${selectedTier}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    toast({
      title: "Wallet updated successfully!",
      description: `Loyalty wallet updated for ${tiers.find(t => t.id.toString() === selectedTier)?.tierName} tier`,
    });
  } catch (error) {
    toast({
      title: "Failed to update wallet",
      description: "wallet tier configuration customization is not found",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  // Helper for update button disabled state
  const hasColor = [
    updateForm.primaryColor,
    updateForm.secondaryColor,
    updateForm.bgColor
  ].some(v => v && (typeof v === 'string' ? v.trim() !== '' : false));
  const hasImage = [
    updateForm.walletIcon,
    updateForm.walletLogo,
    updateForm.walletCoverImage
  ].some(v => v);
  const isUpdateDisabled =
    isLoading ||
    !selectedTier ||
    !(hasColor || hasImage);

  const [qrForm, setQrForm] = useState({
    shopId: '2',
    shopUrlPage: 'https://timely-biscuit-b18131.netlify.app/shop-checkin',
  });
  const [qrLoading, setQrLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const handleQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrImage(null);
    if (!qrForm.shopId || !qrForm.shopUrlPage) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both Shop ID and Shop URL Page.',
        variant: 'destructive',
      });
      return;
    }
    setQrLoading(true);
    try {
      // Adjust the API base as needed
      const res = await api.get(
        `${yeshteryApi}shop_check_in/reward/qrCode`,
        {
          params: {
            shopId: qrForm.shopId,
            shopUrlPage: qrForm.shopUrlPage,
          },
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: 'image/png',
          },
          responseType: 'arraybuffer',
        }
      );
      // Convert arraybuffer to base64 image
      const base64 = btoa(
        new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setQrImage(`data:image/png;base64,${base64}`);
      toast({
        title: 'QR Code generated!',
        description: 'Scan or download the QR code below.',
      });
    } catch (error) {
      toast({
        title: 'Failed to generate QR code',
        description: 'Please check the credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setQrLoading(false);
    }
  };

  const [createConfig, setCreateConfig] = useState({ shopId: '', points: '' });
  const [updateConfig, setUpdateConfig] = useState({ shopId: '', points: '' });
  const [configLoading, setConfigLoading] = useState(false);

  const [redeemForm, setRedeemForm] = useState({ orderId: '', code: '', points: '' });
  const [redeemLoading, setRedeemLoading] = useState(false);


  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar className="border-r bg-white">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setActiveSection('wallet');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isActive={activeSection === 'wallet'}
                  className={activeSection === 'wallet' ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md [&>*]:text-white' : 'hover:bg-accent/20 hover:text-primary'}
                >
                  <Settings className={activeSection === 'wallet' ? 'h-5 w-5 text-white' : 'h-5 w-5'} />
                  <span className={activeSection === 'wallet' ? 'text-white' : ''}>Wallet Customization</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setActiveSection('qr');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isActive={activeSection === 'qr'}
                  className={activeSection === 'qr' ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md [&>*]:text-white' : 'hover:bg-accent/20 hover:text-primary'}
                >
                  <Users className={activeSection === 'qr' ? 'h-5 w-5 text-white' : 'h-5 w-5'} />
                  <span className={activeSection === 'qr' ? 'text-white' : ''}>Shop QR Code</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setActiveSection('config');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isActive={activeSection === 'config'}
                  className={activeSection === 'config' ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md [&>*]:text-white' : 'hover:bg-accent/20 hover:text-primary'}
                >
                  <TrendingUp className={activeSection === 'config' ? 'h-5 w-5 text-white' : 'h-5 w-5'} />
                  <span className={activeSection === 'config' ? 'text-white' : ''}>Shop Check-In Config</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setActiveSection('redeem');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isActive={activeSection === 'redeem'}
                  className={activeSection === 'redeem' ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md [&>*]:text-white' : 'hover:bg-accent/20 hover:text-primary'}
                >
                  <Palette className={activeSection === 'redeem' ? 'h-5 w-5 text-white' : 'h-5 w-5'} />
                  <span className={activeSection === 'redeem' ? 'text-white' : ''}>Redeem Points</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 p-4">
          <div className="w-full">
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

            {/* Wallet Customization (with Tier Selection) */}
            {activeSection === 'wallet' && (
              <GradientCard id="section-wallet" className="bg-gradient-to-br from-white via-gray-50 to-accent/10 border border-accent/20 shadow-lg">
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
                  <div className="space-y-4 mb-6">
                    <Select value={selectedTier} onValueChange={setSelectedTier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiers.map((tier) => (
                          <SelectItem key={tier.id} value={tier.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Badge variant={tier.isSpecial ? "default" : "secondary"}>
                                {tier.tier_name}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* Removed tier info display (Purchase Range, Cashback Rate, Status) */}
                  </div>
                  {/* Wallet Customization Tabs and Forms (existing code) */}
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
                            <input
                              id="create-primary"
                              type="color"
                              value={walletForm.primaryColor}
                              onChange={(e) => setWalletForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
                              value={walletForm.primaryColor}
                              onChange={(e) => setWalletForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              placeholder="#4C1D95"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="create-secondary">Secondary Color</Label>
                          <div className="flex gap-2">
                            <input
                              id="create-secondary"
                              type="color"
                              value={walletForm.secondaryColor}
                              onChange={(e) => setWalletForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
                              value={walletForm.secondaryColor}
                              onChange={(e) => setWalletForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              placeholder="#D97706"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="create-bg">Background Color</Label>
                          <div className="flex gap-2">
                            <input
                              id="create-bg"
                              type="color"
                              value={walletForm.bgColor}
                              onChange={(e) => setWalletForm(prev => ({ ...prev, bgColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
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
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setWalletForm(prev => ({...prev , walletIcon : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Wallet Logo</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload wallet logo</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setWalletForm(prev => ({...prev , walletLogo : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Cover Image</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload cover image</p>
                            <input
                            type="file"
                            accept="image/*"
                            className="mt-2"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setWalletForm((prev) => ({
                                ...prev,
                                walletCoverImage: file,
                              }));
                            }}
                          />                          
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleCreateWallet} 
                        disabled={isCreateDisabled}
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
                            <input
                              id="update-primary"
                              type="color"
                              value={updateForm.primaryColor}
                              onChange={(e) => setUpdateForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
                              value={updateForm.primaryColor}
                              onChange={(e) => setUpdateForm(prev => ({ ...prev, primaryColor: e.target.value }))}
                              placeholder="#4C1D95"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="update-secondary">Secondary Color</Label>
                          <div className="flex gap-2">
                            <input
                              id="update-secondary"
                              type="color"
                              value={updateForm.secondaryColor}
                              onChange={(e) => setUpdateForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
                              value={updateForm.secondaryColor}
                              onChange={(e) => setUpdateForm(prev => ({ ...prev, secondaryColor: e.target.value }))}
                              placeholder="#D97706"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="update-bg">Background Color</Label>
                          <div className="flex gap-2">
                            <input
                              id="update-bg"
                              type="color"
                              value={updateForm.bgColor}
                              onChange={(e) => setUpdateForm(prev => ({ ...prev, bgColor: e.target.value }))}
                              className="w-16 h-10 p-1 border"
                            />
                            <input
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
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setUpdateForm(prev => ({...prev , walletIcon : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Update Logo</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload new logo</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setUpdateForm(prev => ({...prev , walletLogo : e.target.files[0]}))} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Update Cover</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload new cover</p>
                                            
                          <input
                            type="file"
                            accept="image/*"
                            className="mt-2"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setUpdateForm((prev) => ({
                                ...prev,
                                walletCoverImage: file,
                              }));
                            }}
                          />                    
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleUpdateWallet} 
                        disabled={isUpdateDisabled}
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
            )}

            {/* Shop QR Code */}
            {activeSection === 'qr' && (
              <GradientCard className="mt-8 bg-gradient-to-br from-white via-gray-50 to-primary/10 border border-primary/20 shadow-lg" id="section-qr">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Generate Shop QR Code
                  </CardTitle>
                  <CardDescription>
                    Enter Shop ID and Shop URL Page to generate a QR code for shop check-in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleQrSubmit} className="space-y-4 max-w-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shopId">Shop ID</Label>
                        <Input
                          id="shopId"
                          type="number"
                          value={qrForm.shopId}
                          onChange={e => setQrForm(prev => ({ ...prev, shopId: e.target.value }))}
                          placeholder="Enter Shop ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shopUrlPage">Shop URL Page</Label>
                        <Input
                          id="shopUrlPage"
                          type="text"
                          value={qrForm.shopUrlPage}
                          onChange={e => setQrForm(prev => ({ ...prev, shopUrlPage: e.target.value }))}
                          placeholder="https://example.com/shop"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={qrLoading} className="w-full bg-gradient-gold">
                      {qrLoading ? 'Generating...' : 'Generate QR Code'}
                    </Button>
                  </form>
                  {qrImage && (
                    <div className="mt-6 text-center">
                      <img src={qrImage} alt="Shop QR Code" className="mx-auto rounded shadow-lg" width={300} height={300} />
                      <p className="text-sm text-muted-foreground mt-2">Right-click to download the QR code.</p>
                    </div>
                  )}
                </CardContent>
              </GradientCard>
            )}
            {/* Shop Check-In Config */}
            {activeSection === 'config' && (
              <GradientCard className="mt-8 bg-gradient-to-br from-white via-gray-50 to-accent/10 border border-accent/20 shadow-lg" id="section-config">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Shop Check-In Reward Config
                  </CardTitle>
                  <CardDescription>
                    Create or update the reward points configuration for a shop check-in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Shop Check-In Configuration</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Create Config Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!createConfig.shopId || !createConfig.points) {
                          toast({
                            title: 'Missing fields',
                            description: 'Please enter both Shop ID and Points.',
                            variant: 'destructive',
                          });
                          return;
                        }
                        setConfigLoading(true);
                        try {
                          await api.post(
                            `${yeshteryApi}shop_check_in/organization/config/shop/${createConfig.shopId}`,
                            { points: createConfig.points},
                            {
                              headers: {
                                Authorization: `Bearer ${user.token}`,
                                'Content-Type': 'application/json',
                              },
                            }
                          );
                          toast({
                            title: 'Config created!',
                            description: `Shop ${createConfig.shopId} config created with ${createConfig.points} points.`,
                          });
                          setCreateConfig({ shopId: '', points: '' });
                        } catch (err) {
                          const message = err?.response?.data?.message || 'Please try again.';
                          toast({
                            title: 'Failed to create config',
                            description: message,
                            variant: 'destructive',
                          });
                        } finally {
                          setConfigLoading(false);
                        }
                      }}
                      className="space-y-4 mb-8 bg-muted/30 p-4 rounded-lg shadow w-full"
                    >
                      <h4 className="font-medium mb-2">Create Config</h4>
                      <div className="space-y-2">
                        <Label htmlFor="create-shopId">Shop ID</Label>
                        <Input
                          id="create-shopId"
                          type="number"
                          value={createConfig.shopId}
                          onChange={e => setCreateConfig(f => ({ ...f, shopId: e.target.value }))}
                          placeholder="Enter Shop ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-points">Points</Label>
                        <Input
                          id="create-points"
                          type="number"
                          step="0.01"
                          value={createConfig.points}
                          onChange={e => setCreateConfig(f => ({ ...f, points: e.target.value }))}
                          placeholder="Enter Points"
                        />
                      </div>
                      <Button type="submit" disabled={configLoading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow">
                        {configLoading ? 'Creating...' : 'Create Config'}
                      </Button>
                    </form>
                    {/* Update Config Form */}
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!updateConfig.shopId || !updateConfig.points) {
                          toast({
                            title: 'Missing fields',
                            description: 'Please enter both Shop ID and Points.',
                            variant: 'destructive',
                          });
                          return;
                        }
                        setConfigLoading(true);
                        try {
                          await api.put(
                            `${yeshteryApi}shop_check_in/organization/config/shop/${updateConfig.shopId}`,
                            { points: updateConfig.points },
                            {
                              headers: {
                                Authorization: `Bearer ${user.token}`,
                                'Content-Type': 'application/json',
                              },
                            }
                          );
                          toast({
                            title: 'Config updated!',
                            description: `Shop ${updateConfig.shopId} config updated to ${updateConfig.points} points.`,
                          });
                          setUpdateConfig({ shopId: '', points: '' });
                        } catch (err) {
                          toast({
                            title: 'Failed to update config',
                            description: 'Please try again.',
                            variant: 'destructive',
                          });
                        } finally {
                          setConfigLoading(false);
                        }
                      }}
                      className="space-y-4 mb-8 bg-muted/30 p-4 rounded-lg shadow w-full"
                    >
                      <h4 className="font-medium mb-2">Update Config</h4>
                      <div className="space-y-2">
                        <Label htmlFor="update-shopId">Shop ID</Label>
                        <Input
                          id="update-shopId"
                          type="number"
                          value={updateConfig.shopId}
                          onChange={e => setUpdateConfig(f => ({ ...f, shopId: e.target.value }))}
                          placeholder="Enter Shop ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="update-points">Points</Label>
                        <Input
                          id="update-points"
                          type="number"
                          step="0.01"
                          value={updateConfig.points}
                          onChange={e => setUpdateConfig(f => ({ ...f, points: e.target.value }))}
                          placeholder="Enter Points"
                        />
                      </div>
                      <Button type="submit" disabled={configLoading} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow">
                        {configLoading ? 'Updating...' : 'Update Config'}
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </GradientCard>
            )}
            {/* Redeem Points by Code */}
            {activeSection === 'redeem' && (
              <GradientCard className="mt-8 bg-gradient-to-br from-white via-gray-50 to-primary/10 border border-primary/20 shadow-lg" id="section-redeem">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Redeem Points by Code
                  </CardTitle>
                  <CardDescription>
                    Redeem loyalty points using an order ID and code.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!redeemForm.orderId || !redeemForm.code || !redeemForm.points) {
                        toast({
                          title: 'Missing fields',
                          description: 'Please enter both Order ID, Code, and Points.',
                          variant: 'destructive',
                        });
                        return;
                      }
                      setRedeemLoading(true);
                      try {
                        await api.post(
                          `${yeshteryApi}loyalty/points/code/redeem`,
                          {},
                          {
                            headers: {
                              'User-Token': user.token,
                              'Content-Type': 'application/json',
                            },
                            params: {
                              order_id: redeemForm.orderId,
                              code: redeemForm.code,
                              points: redeemForm.points,
                            },
                          }
                        );
                        toast({
                          title: 'Points redeemed!',
                          description: `Order ${redeemForm.orderId} with code ${redeemForm.code} redeemed successfully.`,
                        });
                        setRedeemForm({ orderId: '', code: '', points: '' });
                      } catch (err) {
                        toast({
                          title: 'Failed to redeem points',
                          description: 'Please try again.',
                          variant: 'destructive',
                        });
                      } finally {
                        setRedeemLoading(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="redeem-orderId">Order ID</Label>
                        <Input
                          id="redeem-orderId"
                          type="number"
                          value={redeemForm.orderId}
                          onChange={e => setRedeemForm(f => ({ ...f, orderId: e.target.value }))}
                          placeholder="Enter Order ID"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redeem-code">Code</Label>
                        <Input
                          id="redeem-code"
                          type="text"
                          value={redeemForm.code}
                          onChange={e => setRedeemForm(f => ({ ...f, code: e.target.value }))}
                          placeholder="Enter Code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redeem-points">Points</Label>
                        <Input
                          id="redeem-points"
                          type="number"
                          value={redeemForm.points}
                          onChange={e => setRedeemForm(f => ({ ...f, points: e.target.value }))}
                          placeholder="Enter Points"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={redeemLoading} className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow">
                      {redeemLoading ? 'Redeeming...' : 'Redeem Points'}
                    </Button>
                  </form>
                </CardContent>
              </GradientCard>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
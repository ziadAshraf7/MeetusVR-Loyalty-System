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
  const [subAreas, setSubAreas] = useState([]);
  const [subAreasLoading, setSubAreasLoading] = useState(false);
  const [fetchedShops, setFetchedShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);


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
    try {
      const res = await api.get(yeshteryApi + 'loyalty/tier/list' , {
        headers: {
          'Authorization': `Bearer ${user.token}`, 
          'Content-Type': 'application/json'
        }
      })
      const result = await res.data
      setTiers(result)
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout();
        return;
      }
      // Optionally handle other errors
    }
  }

  useEffect(() => {
    getOrgTiers()
    fetchShops() // Fetch shops on component mount
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

  // Shop data - use fetched shops only
  const shops = fetchedShops.map(shop => ({
    id: shop.id?.toString() || '',
    name: shop.name || shop.pname || 'Unknown Shop'
  }));

  const [qrForm, setQrForm] = useState({
    shopId: '',
    shopUrlPage: 'https://timely-biscuit-b18131.netlify.app/shop-checkin',
  });
  const [qrLoading, setQrLoading] = useState(false);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const handleQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQrImage(null);
    if (!qrForm.shopUrlPage) {
      toast({
        title: 'Missing fields',
        description: 'Please enter Shop URL Page.',
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
            shopId: '2', // Force shopId to 2
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

  const fetchSubAreas = async () => {
    console.log('fetchSubAreas function called');
    console.log('User token:', user?.token ? 'Token exists' : 'No token');
    console.log('API URL:', `${yeshteryApi}organization/sub_areas?area_id=95`);
    
    if (!user?.token) {
      console.log('No user token found.');
      return;
    }
    
    setSubAreasLoading(true);
    try {
      console.log('Making API request...');
      const response = await api.get(
        `${yeshteryApi}organization/sub_areas?area_id=95`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'X-Skip-401-Interceptor': 'true',
          },
        }
      );
      console.log('Sub Areas response:', response.data);
      setSubAreas(response.data);
    } catch (error) {
      console.log('Error caught:', error);
      if (error?.response?.status === 401) {
        console.log('401 Unauthorized: Permission denied for sub areas (no logout).');
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to view sub areas.',
          variant: 'destructive',
        });
      } else {
        console.log('Error fetching sub areas:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch sub areas.',
          variant: 'destructive',
        });
      }
    } finally {
      setSubAreasLoading(false);
    }
  };

  const fetchShops = async () => {
    setShopsLoading(true);
    try {
      const response = await api.get(
        `${yeshteryApi}organization/shops`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'X-Skip-401-Interceptor': 'true',
          },
        }
      );
      const shopList = response.data.content || response.data;
      // For each shop, fetch sub-areas by area_id
      const enrichedShops = await Promise.all(shopList.map(async (shop) => {
        const areaId = shop.address?.area_id;
        let subAreas = [];
        if (areaId) {
          try {
            const subAreaRes = await api.get(`${yeshteryApi}organization/sub_areas?area_id=${areaId}`, {
              headers: { Authorization: `Bearer ${user.token}`, 'X-Skip-401-Interceptor': 'true' },
            });
            subAreas = subAreaRes.data;
          } catch (err) {
            subAreas = [];
          }
        }
        return { ...shop, subAreas };
      }));
      setFetchedShops(enrichedShops);
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout();
        return;
      }
      // Optionally handle other errors
    } finally {
      setShopsLoading(false);
    }
  };

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
                  <span className={activeSection === 'qr' ? 'text-white' : ''}>Shop Check-in QR Code</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    setActiveSection('shops');
                    fetchShops();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isActive={activeSection === 'shops'}
                  className={activeSection === 'shops' ? 'bg-gradient-to-r from-primary to-accent text-white font-bold shadow-md [&>*]:text-white' : 'hover:bg-accent/20 hover:text-primary'}
                >
                  <Users className={activeSection === 'shops' ? 'h-5 w-5 text-white' : 'h-5 w-5'} />
                  <span className={activeSection === 'shops' ? 'text-white' : ''}>Shops</span>
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
                          <Label htmlFor="create-primary" className="text-sm font-semibold text-gray-700">📝 Wallet Titles Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Main color for wallet titles, headers, and primary text elements</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="create-secondary" className="text-sm font-semibold text-gray-700">💰 Title Values Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Color for displaying points, amounts, and important values in the wallet</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="create-bg" className="text-sm font-semibold text-gray-700">Background Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">🍎 Apple Wallet Notification Icon</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload Apple Wallet notification icon (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 512x512px, transparent background</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setWalletForm(prev => ({...prev , walletIcon : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">💳 Wallet Logo</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload wallet logo (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 300x100px, transparent background</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setWalletForm(prev => ({...prev , walletLogo : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">🖼️ Wallet Cover Image</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload wallet cover image (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 1200x600px, high quality</p>
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
                          <Label htmlFor="update-primary" className="text-sm font-semibold text-gray-700">📝 Update Wallet Titles Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Leave empty to keep current wallet titles color</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="update-secondary" className="text-sm font-semibold text-gray-700">💰 Update Title Values Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                          <p className="text-xs text-gray-500">Leave empty to keep current title values color</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="update-bg" className="text-sm font-semibold text-gray-700">Update Background Color</Label>
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
                              className="flex-1 px-3 py-2 border rounded-md"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">🍎 Replace Apple Wallet Notification Icon</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload new Apple Wallet notification icon (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 512x512px, transparent background</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setUpdateForm(prev => ({...prev , walletIcon : e.target.files[0]}))}/>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">💳 Replace Wallet Logo</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload new wallet logo (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 300x100px, transparent background</p>
                            <input type="file" className="mt-2" accept="image/*" onChange={(e) => setUpdateForm(prev => ({...prev , walletLogo : e.target.files[0]}))} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">🖼️ Replace Cover Art</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">Upload new cover image (PNG/JPG)</p>
                            <p className="text-xs text-gray-500 mb-2">Recommended: 1200x600px, high quality</p>
                                            
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
                        <Label htmlFor="shopId">Shop Name</Label>
                        <Select value={qrForm.shopId} onValueChange={(value) => setQrForm(prev => ({ ...prev, shopId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shop" />
                          </SelectTrigger>
                          <SelectContent>
                            {shops.map((shop) => (
                              <SelectItem key={shop.id} value={shop.id}>
                                {shop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    <Button 
                      type="submit" 
                      disabled={qrLoading || !qrForm.shopId || !qrForm.shopUrlPage} 
                      className="w-full bg-gradient-gold"
                    >
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
                            description: 'Please select a shop and enter points.',
                            variant: 'destructive',
                          });
                          return;
                        }
                        setConfigLoading(true);
                        try {
                          await api.post(
                            `${yeshteryApi}shop_check_in/organization/config/shop/${createConfig.shopId}`,
                            { points: createConfig.points },
                            { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' } }
                          );
                          toast({
                            title: 'Config created!',
                            description: `Shop ${shops.find(s => s.id === createConfig.shopId)?.name || createConfig.shopId} config created with ${createConfig.points} points.`,
                          });
                          setCreateConfig({ shopId: '', points: '' });
                        } catch (err) {
                          const message = err?.response?.data?.message || 'Please try again.';
                          const isAlreadyExists = message.toLowerCase().includes('already exists') || 
                                                 message.toLowerCase().includes('duplicate') ||
                                                 err?.response?.status === 409;
                          
                          toast({
                            title: 'Failed to create config',
                            description: isAlreadyExists ? 'Shop configuration already exists for this shop.' : message,
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
                        <Label htmlFor="create-shopId">Shop Name</Label>
                        <Select value={createConfig.shopId} onValueChange={(value) => setCreateConfig(prev => ({ ...prev, shopId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shop" />
                          </SelectTrigger>
                          <SelectContent>
                            {shops.map((shop) => (
                              <SelectItem key={shop.id} value={shop.id}>
                                {shop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <Button 
                        type="submit" 
                        disabled={configLoading || !createConfig.shopId || !createConfig.points} 
                        className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow"
                      >
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
                            description: 'Please select a shop and enter points.',
                            variant: 'destructive',
                          });
                          return;
                        }
                        setConfigLoading(true);
                        try {
                          await api.put(
                            `${yeshteryApi}shop_check_in/organization/config/shop/2`, // Force shopId to 2
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
                            description: `Shop ${shops.find(s => s.id === updateConfig.shopId)?.name || updateConfig.shopId} config updated to ${updateConfig.points} points.`,
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
                        <Label htmlFor="update-shopId">Shop Name</Label>
                        <Select value={updateConfig.shopId} onValueChange={(value) => setUpdateConfig(prev => ({ ...prev, shopId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shop" />
                          </SelectTrigger>
                          <SelectContent>
                            {shops.map((shop) => (
                              <SelectItem key={shop.id} value={shop.id}>
                                {shop.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <Button 
                        type="submit" 
                        disabled={configLoading || !updateConfig.shopId || !updateConfig.points} 
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold shadow"
                      >
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
                              'X-Skip-401-Interceptor': 'true',
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
                        if (err?.response?.status === 401) {
                          toast({
                            title: 'Permission Denied',
                            description: 'The current user is not having the permission to make this action',
                            variant: 'destructive',
                          });
                        } else {
                          toast({
                            title: 'Failed to redeem points',
                            description: 'Please try again.',
                            variant: 'destructive',
                          });
                        }
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
            {/* Shops */}
            {activeSection === 'shops' && (
              <GradientCard className="mt-8 bg-gradient-to-br from-white via-gray-50 to-primary/10 border border-primary/20 shadow-lg" id="section-shops">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Organization Shops
                  </CardTitle>
                  <CardDescription>
                    View all shops in the organization. This data is used in Shop QR Code and Shop Config sections.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {shopsLoading ? (
                    <div className="text-center py-8">
                      <div className="text-blue-600">Loading shops...</div>
                    </div>
                  ) : fetchedShops.length > 0 ? (
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 mb-4">
                        Found {fetchedShops.length} shop(s)
                      </div>
                      <div className="grid gap-4">
                        {fetchedShops.map((shop, index) => (
                          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{shop.name || shop.pname}</h3>
                                <p className="text-sm text-gray-600">ID: {shop.id}</p>
                                {shop.address && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    Address: {shop.address.address || 'No address'}
                                  </p>
                                )}
                                {shop.isWarehouse && (
                                  <Badge variant="secondary" className="mt-1">Warehouse</Badge>
                                )}
                              </div>
                              {shop.subAreas && shop.subAreas.length > 0 && (
                                <div className="mt-2 text-xs text-gray-500">
                                  <div>Sub Areas:</div>
                                  <ul className="list-disc ml-4">
                                    {shop.subAreas.map((sub, idx) => (
                                      <li key={sub.id || idx}>{sub.name || sub.id}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {shop.logo && (
                                <img 
                                  src={shop.logo} 
                                  alt={`${shop.name} logo`} 
                                  className="w-12 h-12 rounded object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500">No shops found</div>
                      <Button 
                        onClick={fetchShops} 
                        className="mt-4 bg-gradient-to-r from-primary to-accent text-white font-semibold shadow"
                      >
                        Retry Fetch
                      </Button>
                    </div>
                  )}
                </CardContent>
              </GradientCard>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
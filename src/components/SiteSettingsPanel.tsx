<lov-code>
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Settings, Palette, Type, Image, User, Upload, Menu, Plus, Trash2, Paintbrush } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { NavButton } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const SiteSettingsPanel = () => {
  const { toast } = useToast();
  const { settings, updateNavBarSettings, updateNavButtons, updateColorSettings, updateGeneralSettings, uploadLogo } = useSiteSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [navBarForm, setNavBarForm] = useState({
    showLogo: settings.navBar.showLogo,
    showText: settings.navBar.showText,
    logoUrl: settings.navBar.logoUrl,
    siteTitle: settings.navBar.siteTitle,
    showAdminButton: settings.navBar.showAdminButton,
  });
  
  const [navButtons, setNavButtons] = useState<NavButton[]>(
    settings.navBar.buttons || []
  );
  
  const [colorForm, setColorForm] = useState({
    primary: settings.colors.primary,
    secondary: settings.colors.secondary,
    accent: settings.colors.accent,
    useCustomGradients: settings.colors.useCustomGradients || false,
    defaultGradient: settings.colors.defaultGradient || 'bg-gradient-to-br from-violet-500 to-purple-600',
    fashionGradient: settings.colors.fashionGradient || 'bg-gradient-to-br from-pink-500 to-purple-600',
    foodGradient: settings.colors.foodGradient || 'bg-gradient-to-br from-orange-400 to-red-500',
    electronicsGradient: settings.colors.electronicsGradient || 'bg-gradient-to-br from-blue-400 to-indigo-600',
    travelGradient: settings.colors.travelGradient || 'bg-gradient-to-br from-teal-400 to-emerald-500',
    beautyGradient: settings.colors.beautyGradient || 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    homeGradient: settings.colors.homeGradient || 'bg-gradient-to-br from-amber-400 to-yellow-500',
  });
  
  const [generalForm, setGeneralForm] = useState({
    siteDescription: settings.general.siteDescription,
    footerText: settings.general.footerText,
  });

  const [adminForm, setAdminForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newButtonData, setNewButtonData] = useState({
    label: '',
    path: ''
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem('adminEmail');
    if (storedEmail) {
      setAdminForm(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);

  useEffect(() => {
    setNavBarForm({
      showLogo: settings.navBar.showLogo,
      showText: settings.navBar.showText,
      logoUrl: settings.navBar.logoUrl,
      siteTitle: settings.navBar.siteTitle,
      showAdminButton: settings.navBar.showAdminButton
    });
    
    setNavButtons(settings.navBar.buttons || []);
    
    setColorForm({
      primary: settings.colors.primary,
      secondary: settings.colors.secondary,
      accent: settings.colors.accent,
      useCustomGradients: settings.colors.useCustomGradients || false,
      defaultGradient: settings.colors.defaultGradient || 'bg-gradient-to-br from-violet-500 to-purple-600',
      fashionGradient: settings.colors.fashionGradient || 'bg-gradient-to-br from-pink-500 to-purple-600',
      foodGradient: settings.colors.fashionGradient || 'bg-gradient-to-br from-orange-400 to-red-500',
      electronicsGradient: settings.colors.electronicsGradient || 'bg-gradient-to-br from-blue-400 to-indigo-600',
      travelGradient: settings.colors.travelGradient || 'bg-gradient-to-br from-teal-400 to-emerald-500',
      beautyGradient: settings.colors.beautyGradient || 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
      homeGradient: settings.colors.homeGradient || 'bg-gradient-to-br from-amber-400 to-yellow-500',
    });
    
    setGeneralForm({
      siteDescription: settings.general.siteDescription,
      footerText: settings.general.footerText,
    });
  }, [settings]);
  
  const handleNavBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSettings = {
      ...navBarForm,
      buttons: navButtons
    };
    
    updateNavBarSettings(updatedSettings);
    updateNavButtons(navButtons);
    
    toast({
      title: "Success",
      description: "Navigation bar settings updated successfully",
    });
  };
  
  const handleColorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateColorSettings(colorForm);
    toast({
      title: "Success",
      description: "Color settings updated successfully",
    });
  };
  
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralSettings(generalForm);
    toast({
      title: "Success",
      description: "General settings updated successfully",
    });
  };

  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminForm.email) {
      toast({
        title: "Error",
        description: "Admin email is required.",
        variant: "destructive",
      });
      return;
    }

    const storedPassword = localStorage.getItem('adminPassword');
    if (adminForm.currentPassword !== storedPassword) {
      toast({
        title: "Error",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.newPassword) {
      if (adminForm.newPassword !== adminForm.confirmPassword) {
        toast({
          title: "Error",
          description: "New passwords don't match.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('adminPassword', adminForm.newPassword);
    }

    localStorage.setItem('adminEmail', adminForm.email);

    setAdminForm(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));

    toast({
      title: "Success",
      description: "Admin credentials updated successfully.",
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 20;
          return next > 90 ? 90 : next;
        });
      }, 200);
      
      const logoUrl = await uploadLogo(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setNavBarForm(prev => ({
        ...prev,
        logoUrl
      }));
      
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const addNavButton = () => {
    if (newButtonData.label.trim() === '' || newButtonData.path.trim() === '') {
      toast({
        title: 'Error',
        description: 'Button label and path are required',
        variant: 'destructive'
      });
      return;
    }
    
    const newButton: NavButton = {
      id: uuidv4(),
      label: newButtonData.label,
      path: newButtonData.path,
      enabled: true
    };
    
    const updatedButtons = [...navButtons, newButton];
    setNavButtons(updatedButtons);
    setNewButtonData({ label: '', path: '' });
    
    toast({
      title: 'Success',
      description: `Added button: ${newButtonData.label}`
    });
  };
  
  const removeNavButton = (id: string) => {
    const updatedButtons = navButtons.filter(button => button.id !== id);
    setNavButtons(updatedButtons);
    
    toast({
      title: 'Success',
      description: 'Navigation button removed'
    });
  };
  
  const toggleNavButton = (id: string) => {
    const updatedButtons = navButtons.map(button => 
      button.id === id ? { ...button, enabled: !button.enabled } : button
    );
    setNavButtons(updatedButtons);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const gradientOptions = [
    { value: 'bg-gradient-to-r from-blue-500 to-indigo-600', label: 'Blue to Indigo' },
    { value: 'bg-gradient-to-r from-purple-500 to-pink-500', label: 'Purple to Pink' },
    { value: 'bg-gradient-to-r from-green-400 to-teal-500', label: 'Green to Teal' },
    { value: 'bg-gradient-to-r from-red-500 to-orange-500', label: 'Red to Orange' },
    { value: 'bg-gradient-to-r from-yellow-400 to-amber-500', label: 'Yellow to Amber' },
    { value: 'bg-gradient-to-r from-cyan-500 to-blue-500', label: 'Cyan to Blue' },
    { value: 'bg-gradient-to-r from-fuchsia-500 to-pink-500', label: 'Fuchsia to Pink' },
    { value: 'bg-gradient-to-r from-rose-500 to-red-500', label: 'Rose to Red' },
  ];

  const renderGradientPreview = (gradientClass: string) => {
    return (
      <div className={`h-8 rounded-md ${gradientClass}`}></div>
    );
  };

  const handleGradientChange = (category: keyof typeof colorForm, gradientClass: string) => {
    setColorForm({
      ...colorForm,
      [category]: gradientClass
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <CardTitle>Site Settings</CardTitle>
        </div>
        <CardDescription>
          Customize your site appearance and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="navbar">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="navbar" className="flex items-center gap-1">
              <Image size={14} />
              <span>Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-1">
              <Palette size={14} />
              <span>Colors</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Type size={14} />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-1">
              <User size={14} />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="navbar">
            <form onSubmit={handleNavBarSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showLogo" 
                      checked={navBarForm.showLogo}
                      onCheckedChange={(checked) => setNavBarForm({...navBarForm, showLogo: checked as boolean})}
                    />
                    <Label htmlFor="showLogo">Show Logo</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showText" 
                      checked={navBarForm.showText}
                      onCheckedChange={(checked) => setNavBarForm({...navBarForm, showText: checked as boolean})}
                    />
                    <Label htmlFor="showText">Show Site Title</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="showAdminButton" 
                      checked={navBarForm.showAdminButton}
                      onCheckedChange={(checked) => setNavBarForm({...navBarForm, showAdminButton: checked as boolean})}
                    />
                    <Label htmlFor="showAdminButton">Show Admin Button (in Navigation)</Label>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="logoPreview">Logo Preview</Label>
                  <div className="h-16 w-full bg-muted rounded-md flex items-center justify-center">
                    {navBarForm.showLogo && (
                      <img 
                        src={navBarForm.logoUrl} 
                        alt="Logo Preview" 
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://static.vecteezy.com/system/resources/thumbnails/012/872/334/small_2x/discount-coupon-3d-png.png';
                        }}
                      />
                    )}
                    {navBarForm.showText && (
                      <span className={`font-display font-semibold text-xl ${navBarForm.showLogo ? 'ml-2' : ''}`}>
                        {navBarForm.siteTitle}
                      </span>
                    )}
                    {!navBarForm.showLogo && !navBarForm.showText && (
                      <span className="text-muted-foreground text-sm">Both logo and title are hidden</span>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Logo Image</Label>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={isUploading || !navBarForm.showLogo}
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={triggerFileInput}
                        disabled={isUploading || !navBarForm.showLogo}
                        className="gap-2"
                      >
                        <Upload size={16} />
                        Upload Logo
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setNavBarForm({...navBarForm, logoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/012/872/334/small_2x/discount-coupon-3d-png.png'})}
                        disabled={isUploading || !navBarForm.showLogo}
                        className="text-sm"
                      >
                        Reset to Default
                      </Button>
                    </div>
                    
                    {isUploading && (
                      <div className="space-y-1">
                        <Progress value={uploadProgress} className="h-2 w-full" />
                        <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      Accepted formats: PNG, JPG, GIF, SVG. Max size: 2MB
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="logoUrl">Logo URL (or use upload above)</Label>
                  <Input 
                    id="logoUrl"
                    placeholder="Enter logo URL"
                    value={navBarForm.logoUrl}
                    onChange={(e) => setNavBarForm({...navBarForm, logoUrl: e.target.value})}
                    disabled={!navBarForm.showLogo}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input 
                    id="siteTitle"
                    placeholder="Enter site title"
                    value={navBarForm.siteTitle}
                    onChange={(e) => setNavBarForm({...navBarForm, siteTitle: e.target.value})}
                    disabled={!navBarForm.showText}
                  />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Menu size={18} />
                    <h3 className="text-base font-medium">Navigation Buttons</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure which buttons appear in the navigation bar
                  </p>
                </div>
                
                <div className="space-y-3">
                  {navButtons.map((button) => (
                    <div key={button.id} className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">{button.label}</div>
                        <div className="text-xs text-muted-foreground">{button.path}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`enable-${button.id}`}
                            checked={button.enabled}
                            onCheckedChange={() => toggleNavButton(button.id)}
                          />
                          <Label htmlFor={`enable-${button.id}`} className="text-xs">
                            {button.enabled ? 'Enabled' : 'Disabled'}
                          </Label>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeNavButton(button.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-3 border border-dashed rounded-md space-y-3">
                    <div className="text-sm font-medium">Add New Navigation Button</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Button Label"
                        value={newButtonData.label}
                        onChange={(e) => setNewButtonData({...newButtonData, label: e.target.value})}
                      />
                      <Input
                        placeholder="Button Path (e.g. /categories)"
                        value={newButtonData.path}
                        onChange={(e) => setNewButtonData({...newButtonData, path: e.target.value})}
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={addNavButton}
                      className="w-full gap-1"
                      variant="outline"
                    >
                      <Plus size={16} />
                      Add Button
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Save Navigation Settings</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="colors">
            <form onSubmit={handleColorSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: colorForm.primary }}
                    ></div>
                    <Input 
                      id="primaryColor"
                      type="color"
                      value={colorForm.primary}
                      onChange={(e) => setColorForm({...colorForm, primary: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: colorForm.secondary }}
                    ></div>
                    <Input 
                      id="secondaryColor"
                      type="color"
                      value={colorForm.secondary}
                      onChange={(e) => setColorForm({...colorForm, secondary: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: colorForm.accent }}
                    ></div>
                    <Input 
                      id="accentColor"
                      type="color"
                      value={colorForm.accent}
                      onChange={(e) => setColorForm({...colorForm, accent: e.target.value})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center space-x-2 mb-4">
                <Switch
                  id="useCustomGradients"
                  checked={colorForm.useCustomGradients}
                  onCheckedChange={(checked) => setColorForm({...colorForm, useCustomGradients: checked})}
                />
                <Label htmlFor="useCustomGradients" className="cursor-pointer">
                  Use Custom Gradients for Categories
                </Label>
              </div>
              
              {colorForm.useCustomGradients && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="default">
                    <AccordionTrigger className="text-sm">Default Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.defaultGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.defaultGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('defaultGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="fashion">
                    <AccordionTrigger className="text-sm">Fashion Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.fashionGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.fashionGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('fashionGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="food">
                    <AccordionTrigger className="text-sm">Food Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.foodGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.foodGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('foodGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="electronics">
                    <AccordionTrigger className="text-sm">Electronics Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.electronicsGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.electronicsGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('electronicsGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="travel">
                    <AccordionTrigger className="text-sm">Travel Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.travelGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.travelGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('travelGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="beauty">
                    <AccordionTrigger className="text-sm">Beauty Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.beautyGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.beautyGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('beautyGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="home">
                    <AccordionTrigger className="text-sm">Home Gradient</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {renderGradientPreview(colorForm.homeGradient || '')}
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {gradientOptions.map((gradient, idx) => (
                            <Button
                              key={idx}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-8 justify-start p-0 overflow-hidden ${
                                colorForm.homeGradient === gradient.value ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => handleGradientChange('homeGradient', gradient.value)}
                            >
                              <div className={`${gradient.value} w-8 h-full mr-2`}></div>
                              <span className="truncate text-xs">{gradient.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              
              <Button type="submit" className="w-full mt-4">Save Color Settings</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="general">
            <form onSubmit={handleGeneralSubmit} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input 
                    id="siteDescription"
                    placeholder="Enter site description"
                    value={generalForm.siteDescription}
                    onChange={(e) => setGeneralForm({...generalForm, siteDescription: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">This description appears on the homepage</p>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Input 
                    id="footerText"
                    placeholder="Enter footer text"
                    value={generalForm.footerText}
                    onChange={(e) => setGeneralForm({...generalForm, footerText: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">Use © for copyright symbol. Current year: 2025</p>
                </div>
              </div>
              
              <Button type="submit" className="w-full">Save Content Settings</Button>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleAdminCredentialsSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Admin Credentials</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your admin login information
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input 
                      id="adminEmail"
                      type="email"
                      placeholder="admin@example.com"
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-1">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      placeholder

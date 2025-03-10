import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Trash, AlertCircle, Edit, ArrowUpCircle, Plus, Image, Palette, Tag } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { NavButton } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { SeoSettingsTab } from './SeoSettingsTab';

export const SiteSettingsPanel = () => {
  const { settings, updateNavBarSettings, updateColorSettings, updateGeneralSettings, updateNavButtons, uploadLogo } = useSiteSettings();
  const { toast } = useToast();
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonPath, setNewButtonPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNavBarSettings({ showLogo: e.target.checked });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNavBarSettings({ showText: e.target.checked });
  };

  const handleSiteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNavBarSettings({ siteTitle: e.target.value });
  };

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColorSettings({ primary: e.target.value });
  };

  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColorSettings({ secondary: e.target.value });
  };

  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColorSettings({ accent: e.target.value });
  };

  const handleSiteDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateGeneralSettings({ siteDescription: e.target.value });
  };

  const handleFooterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateGeneralSettings({ footerText: e.target.value });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      await uploadLogo(file);
      toast({
        title: "Logo updated",
        description: "Your site logo has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error uploading logo",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddNavButton = () => {
    if (newButtonLabel && newButtonPath) {
      const newButton: NavButton = {
        id: newButtonLabel.toLowerCase().replace(/\s+/g, '-'),
        label: newButtonLabel,
        path: newButtonPath,
        enabled: true,
      };
      updateNavButtons([...settings.navBar.buttons, newButton]);
      setNewButtonLabel('');
      setNewButtonPath('');
      toast({
        title: "Nav Button Added",
        description: "New navigation button has been added successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <Tabs defaultValue="navbar">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="navbar">Navbar</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="navbar" className="mt-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="show-logo">Show Logo</Label>
                <Switch id="show-logo" checked={settings.navBar.showLogo} onCheckedChange={(checked) => updateNavBarSettings({ showLogo: checked })} />
              </div>
              
              <div className="grid gap-3">
                <Label>Logo Image</Label>
                <div className="flex items-start gap-4">
                  <div className="border rounded-md p-2 bg-muted/50 w-20 h-20 flex items-center justify-center">
                    {settings.navBar.logoUrl ? (
                      <img 
                        src={settings.navBar.logoUrl} 
                        alt="Site Logo" 
                        className="max-w-full max-h-full object-contain" 
                      />
                    ) : (
                      <Image className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        disabled={isUploading}
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <ArrowUpCircle size={16} />
                        {isUploading ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/svg+xml"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended size: Square image (1:1 ratio). Supported formats: PNG, JPG, GIF, SVG.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="show-text">Show Text</Label>
                <Switch id="show-text" checked={settings.navBar.showText} onCheckedChange={(checked) => updateNavBarSettings({ showText: checked })} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" value={settings.navBar.siteTitle} onChange={handleSiteTitleChange} />
              </div>
              
              <div className="mt-4">
                <Label className="mb-2 block">Navbar Preview</Label>
                <div className="border rounded-lg p-4 bg-background shadow-sm">
                  <div className="flex items-center space-x-2">
                    {settings.navBar.showLogo && (
                      <div className="h-8 w-8 flex-shrink-0">
                        {settings.navBar.logoUrl ? (
                          <img 
                            src={settings.navBar.logoUrl} 
                            alt="Logo Preview" 
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32x32?text=Logo';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted rounded-sm">
                            <Tag size={16} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    )}
                    {settings.navBar.showText && (
                      <span className="font-display font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                        {settings.navBar.siteTitle || 'Site Title'}
                      </span>
                    )}
                    {!settings.navBar.showLogo && !settings.navBar.showText && (
                      <div className="text-sm text-muted-foreground italic">
                        Please enable logo or text to show navbar content
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is a preview of how your navbar brand will appear on your site.
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Navigation Buttons</h3>
                <ul className="mt-2 space-y-1">
                  {settings.navBar.buttons.map((button) => (
                    <li key={button.id} className="flex items-center justify-between">
                      <span>{button.label} ({button.path})</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Label"
                    value={newButtonLabel}
                    onChange={(e) => setNewButtonLabel(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Path"
                    value={newButtonPath}
                    onChange={(e) => setNewButtonPath(e.target.value)}
                  />
                  <Button size="sm" onClick={handleAddNavButton}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="mt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input type="color" id="primary-color" value={settings.colors.primary} onChange={handlePrimaryColorChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input type="color" id="secondary-color" value={settings.colors.secondary} onChange={handleSecondaryColorChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Input type="color" id="accent-color" value={settings.colors.accent} onChange={handleAccentColorChange} />
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="use-custom-gradients" className="font-medium">Use Custom Gradients</Label>
                  <Switch 
                    id="use-custom-gradients" 
                    checked={settings.colors.useCustomGradients} 
                    onCheckedChange={(checked) => updateColorSettings({ useCustomGradients: checked })} 
                  />
                </div>
                
                {settings.colors.useCustomGradients && (
                  <div className="space-y-4 border-l-2 pl-4 ml-2 border-muted">
                    <div className="grid gap-2">
                      <Label htmlFor="default-gradient">Default Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.defaultGradient}`}></div>
                        <Input 
                          id="default-gradient" 
                          value={settings.colors.defaultGradient} 
                          onChange={(e) => updateColorSettings({ defaultGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Tailwind format: bg-gradient-to-br from-color-value to-color-value</p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="fashion-gradient">Fashion Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.fashionGradient}`}></div>
                        <Input 
                          id="fashion-gradient" 
                          value={settings.colors.fashionGradient} 
                          onChange={(e) => updateColorSettings({ fashionGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="food-gradient">Food Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.foodGradient}`}></div>
                        <Input 
                          id="food-gradient" 
                          value={settings.colors.foodGradient} 
                          onChange={(e) => updateColorSettings({ foodGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="electronics-gradient">Electronics Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.electronicsGradient}`}></div>
                        <Input 
                          id="electronics-gradient" 
                          value={settings.colors.electronicsGradient} 
                          onChange={(e) => updateColorSettings({ electronicsGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="travel-gradient">Travel Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.travelGradient}`}></div>
                        <Input 
                          id="travel-gradient" 
                          value={settings.colors.travelGradient} 
                          onChange={(e) => updateColorSettings({ travelGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="beauty-gradient">Beauty Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.beautyGradient}`}></div>
                        <Input 
                          id="beauty-gradient" 
                          value={settings.colors.beautyGradient} 
                          onChange={(e) => updateColorSettings({ beautyGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="home-gradient">Home Gradient</Label>
                      <div className="flex gap-3 items-center">
                        <div className={`w-12 h-6 rounded ${settings.colors.homeGradient}`}></div>
                        <Input 
                          id="home-gradient" 
                          value={settings.colors.homeGradient} 
                          onChange={(e) => updateColorSettings({ homeGradient: e.target.value })} 
                          placeholder="Tailwind CSS gradient class"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea id="site-description" value={settings.general.siteDescription} onChange={handleSiteDescriptionChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input id="footer-text" value={settings.general.footerText} onChange={handleFooterTextChange} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoSettingsTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

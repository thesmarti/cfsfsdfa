import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Copy, Trash, AlertCircle, Edit, ArrowUpCircle, Plus, Image, Palette, Tag, Save } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { NavButton, GradientPreset } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { SeoSettingsTab } from './SeoSettingsTab';
import { GradientPresets } from './GradientPresets';
import { ColorPresets, ColorPreset } from './ColorPresets';

const COLOR_PRESETS: ColorPreset[] = [
  { id: 'blue-purple', name: 'Blue Purple', primary: '#3b82f6', secondary: '#8b5cf6', accent: '#ec4899' },
  { id: 'green-teal', name: 'Green Teal', primary: '#10b981', secondary: '#0ea5e9', accent: '#f59e0b' },
  { id: 'red-orange', name: 'Red Orange', primary: '#ef4444', secondary: '#f97316', accent: '#8b5cf6' },
  { id: 'pink-purple', name: 'Pink Purple', primary: '#ec4899', secondary: '#8b5cf6', accent: '#3b82f6' },
  { id: 'amber-orange', name: 'Amber Orange', primary: '#f59e0b', secondary: '#f97316', accent: '#10b981' },
  { id: 'indigo-blue', name: 'Indigo Blue', primary: '#6366f1', secondary: '#3b82f6', accent: '#ec4899' },
  { id: 'emerald-green', name: 'Emerald Green', primary: '#10b981', secondary: '#6366f1', accent: '#f97316' },
  { id: 'rose-pink', name: 'Rose Pink', primary: '#f43f5e', secondary: '#ec4899', accent: '#3b82f6' },
];

export const SiteSettingsPanel = () => {
  const { settings, updateNavBarSettings, updateColorSettings, updateGeneralSettings, updateNavButtons, uploadLogo, applyUIGradient } = useSiteSettings();
  const { toast } = useToast();
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonPath, setNewButtonPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [navbarSettings, setNavbarSettings] = useState({ ...settings.navBar });
  const [colorSettings, setColorSettings] = useState({ ...settings.colors });
  const [generalSettings, setGeneralSettings] = useState({ ...settings.general });
  
  useEffect(() => {
    if (!settings.colors.gradientPresets) {
      updateColorSettings({ gradientPresets: [] });
    }
  }, [settings.colors]);

  useEffect(() => {
    setNavbarSettings({ ...settings.navBar });
    setColorSettings({ ...settings.colors });
    setGeneralSettings({ ...settings.general });
  }, [settings]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavbarSettings({ ...navbarSettings, showLogo: e.target.checked });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavbarSettings({ ...navbarSettings, showText: e.target.checked });
  };

  const handleSiteTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNavbarSettings({ ...navbarSettings, siteTitle: e.target.value });
  };

  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorSettings({ ...colorSettings, primary: e.target.value });
  };

  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorSettings({ ...colorSettings, secondary: e.target.value });
  };

  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorSettings({ ...colorSettings, accent: e.target.value });
  };

  const handleSiteDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneralSettings({ ...generalSettings, siteDescription: e.target.value });
  };

  const handleFooterTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneralSettings({ ...generalSettings, footerText: e.target.value });
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

  const handleSaveNavbarSettings = () => {
    updateNavBarSettings(navbarSettings);
    toast({
      title: "Navbar Settings Saved",
      description: "Your navbar settings have been updated successfully.",
    });
  };

  const handleSaveColorSettings = () => {
    updateColorSettings(colorSettings);
    toast({
      title: "Color Settings Saved",
      description: "Your color settings have been updated successfully.",
    });
  };

  const handleSaveGeneralSettings = () => {
    updateGeneralSettings(generalSettings);
    toast({
      title: "General Settings Saved",
      description: "Your general settings have been updated successfully.",
    });
  };

  const handleGradientPresetSelect = (preset: GradientPreset) => {
    switch (preset.category) {
      case 'fashion':
        updateColorSettings({ fashionGradient: preset.value });
        break;
      case 'food':
        updateColorSettings({ foodGradient: preset.value });
        break;
      case 'electronics':
        updateColorSettings({ electronicsGradient: preset.value });
        break;
      case 'travel':
        updateColorSettings({ travelGradient: preset.value });
        break;
      case 'beauty':
        updateColorSettings({ beautyGradient: preset.value });
        break;
      case 'home':
        updateColorSettings({ homeGradient: preset.value });
        break;
      default:
        updateColorSettings({ defaultGradient: preset.value });
        break;
    }
    
    toast({
      title: "Gradient Applied",
      description: `Applied the ${preset.name} gradient`,
    });
  };

  const applyPresetToAll = (preset: GradientPreset) => {
    updateColorSettings({
      defaultGradient: preset.value,
      fashionGradient: preset.value,
      foodGradient: preset.value,
      electronicsGradient: preset.value,
      travelGradient: preset.value,
      beautyGradient: preset.value,
      homeGradient: preset.value,
    });
    
    toast({
      title: "Gradient Applied to All Categories",
      description: `Applied the ${preset.name} gradient to all categories`,
    });
  };

  const handleApplyToUI = (preset: GradientPreset) => {
    applyUIGradient(preset);
  };

  const filterPresetsByCategory = (category: string) => {
    return settings.colors.gradientPresets?.filter(
      preset => preset.category === category || preset.category === 'default'
    ) || [];
  };

  const handleUseCustomGradients = (checked: boolean) => {
    setColorSettings({
      ...colorSettings,
      useCustomGradients: checked
    });
  };

  const handleColorPresetSelect = (preset: ColorPreset) => {
    setColorSettings({
      ...colorSettings,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent
    });
    
    toast({
      title: "Color Preset Applied",
      description: `Applied the "${preset.name}" color preset`,
    });
  };

  const getCurrentColorPresetId = () => {
    return COLOR_PRESETS.find(
      preset => 
        preset.primary === colorSettings.primary && 
        preset.secondary === colorSettings.secondary && 
        preset.accent === colorSettings.accent
    )?.id;
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
                <Switch id="show-logo" checked={navbarSettings.showLogo} onCheckedChange={(checked) => setNavbarSettings({...navbarSettings, showLogo: checked})} />
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
                <Switch id="show-text" checked={navbarSettings.showText} onCheckedChange={(checked) => setNavbarSettings({...navbarSettings, showText: checked})} />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" value={navbarSettings.siteTitle} onChange={handleSiteTitleChange} />
              </div>
              
              <div className="mt-4">
                <Label className="mb-2 block">Navbar Preview</Label>
                <div className="border rounded-lg p-4 bg-background shadow-sm">
                  <div className="flex items-center space-x-2">
                    {navbarSettings.showLogo && (
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
                    {navbarSettings.showText && (
                      <span className={`font-display font-semibold text-lg bg-clip-text text-transparent ${settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}>
                        {navbarSettings.siteTitle || 'Site Title'}
                      </span>
                    )}
                    {!navbarSettings.showLogo && !navbarSettings.showText && (
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
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveNavbarSettings} className="gap-2">
                <Save size={16} />
                Save Navbar Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="mt-6">
            <div className="grid gap-6">
              <ColorPresets 
                presets={COLOR_PRESETS}
                onSelectPreset={handleColorPresetSelect}
                selectedPreset={getCurrentColorPresetId()}
              />
              
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <Input 
                  type="color" 
                  id="primary-color" 
                  value={colorSettings.primary} 
                  onChange={handlePrimaryColorChange}
                  disabled={colorSettings.useCustomGradients}
                  className={colorSettings.useCustomGradients ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <Input 
                  type="color" 
                  id="secondary-color" 
                  value={colorSettings.secondary} 
                  onChange={handleSecondaryColorChange}
                  disabled={colorSettings.useCustomGradients}
                  className={colorSettings.useCustomGradients ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Input 
                  type="color" 
                  id="accent-color" 
                  value={colorSettings.accent} 
                  onChange={handleAccentColorChange}
                  disabled={colorSettings.useCustomGradients}
                  className={colorSettings.useCustomGradients ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>
              
              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label htmlFor="use-custom-gradients" className="font-medium">Use Custom Gradients</Label>
                  <Switch 
                    id="use-custom-gradients" 
                    checked={colorSettings.useCustomGradients}
                    onCheckedChange={handleUseCustomGradients}
                  />
                </div>
                
                {colorSettings.useCustomGradients && (
                  <div className="space-y-4 border-l-2 pl-4 ml-2 border-muted">
                    <div className="grid gap-4">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-2">Global UI Gradient</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select a gradient to apply to the entire UI including navbar text and buttons:
                        </p>
                        <div className="mb-3">
                          <div className={`h-8 rounded ${settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}></div>
                        </div>
                        <GradientPresets 
                          presets={settings.colors.gradientPresets || []} 
                          onSelectPreset={handleApplyToUI}
                          selectedValue={settings.colors.uiGradient}
                        />
                      </div>
                      
                      <Label>Category Gradients</Label>
                      <Tabs defaultValue="default">
                        <TabsList className="grid grid-cols-3">
                          <TabsTrigger value="default">Default</TabsTrigger>
                          <TabsTrigger value="category">By Category</TabsTrigger>
                          <TabsTrigger value="custom">Custom</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="default" className="mt-4">
                          <div className="space-y-4">
                            <GradientPresets 
                              presets={settings.colors.gradientPresets || []} 
                              onSelectPreset={applyPresetToAll}
                              onApplyToUI={handleApplyToUI}
                              selectedValue={settings.colors.defaultGradient}
                            />
                            <p className="text-xs text-muted-foreground">
                              Click on a preset to apply it to all categories
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="category" className="mt-4">
                          <div className="space-y-6">
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('default')}
                                onSelectPreset={(preset) => updateColorSettings({ defaultGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.defaultGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('fashion')}
                                onSelectPreset={(preset) => updateColorSettings({ fashionGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.fashionGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('food')}
                                onSelectPreset={(preset) => updateColorSettings({ foodGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.foodGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('electronics')}
                                onSelectPreset={(preset) => updateColorSettings({ electronicsGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.electronicsGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('travel')}
                                onSelectPreset={(preset) => updateColorSettings({ travelGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.travelGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('beauty')}
                                onSelectPreset={(preset) => updateColorSettings({ beautyGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.beautyGradient}
                              />
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
                              <GradientPresets 
                                presets={filterPresetsByCategory('home')}
                                onSelectPreset={(preset) => updateColorSettings({ homeGradient: preset.value })}
                                onApplyToAll={applyPresetToAll}
                                onApplyToUI={handleApplyToUI}
                                selectedValue={settings.colors.homeGradient}
                              />
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="custom" className="mt-4">
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Enter custom Tailwind CSS gradient classes. Format example: 
                              <code className="ml-1 px-1 py-0.5 bg-muted rounded text-xs">
                                bg-gradient-to-r from-pink-500 to-purple-600
                              </code>
                            </p>
                            <div className="grid gap-2">
                              <Label htmlFor="custom-gradient">Custom Gradient</Label>
                              <div className="flex gap-3 items-center">
                                <Input 
                                  id="custom-gradient" 
                                  placeholder="Enter a Tailwind CSS gradient class"
                                />
                                <Button size="sm">Apply</Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveColorSettings} className="gap-2">
                <Save size={16} />
                Save Color Settings
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea id="site-description" value={generalSettings.siteDescription} onChange={handleSiteDescriptionChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="footer-text">Footer Text</Label>
                <Input id="footer-text" value={generalSettings.footerText} onChange={handleFooterTextChange} />
              </div>
            </div>
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveGeneralSettings} className="gap-2">
                <Save size={16} />
                Save General Settings
              </Button>
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

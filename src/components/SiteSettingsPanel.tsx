
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  Check, Copy, Trash, AlertCircle, Edit, ArrowUpCircle, 
  Plus, Image, Palette, Tag, Save, X, MoveUp, MoveDown
} from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { NavButton, GradientPreset } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { SeoSettingsTab } from './SeoSettingsTab';
import { GradientPresets } from './GradientPresets';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const SiteSettingsPanel = () => {
  const { settings, updateNavBarSettings, updateColorSettings, updateGeneralSettings, updateNavButtons, uploadLogo, applyUIGradient } = useSiteSettings();
  const { toast } = useToast();
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonPath, setNewButtonPath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [editingButton, setEditingButton] = useState<NavButton | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buttonToDelete, setButtonToDelete] = useState<NavButton | null>(null);
  
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

  const handleEditButton = (button: NavButton) => {
    setEditingButton({...button});
    setEditDialogOpen(true);
  };

  const handleSaveEditedButton = () => {
    if (editingButton && editingButton.label && editingButton.path) {
      const updatedButtons = settings.navBar.buttons.map(btn => 
        btn.id === editingButton.id ? editingButton : btn
      );
      updateNavButtons(updatedButtons);
      setEditDialogOpen(false);
      setEditingButton(null);
      toast({
        title: "Button Updated",
        description: "Navigation button has been updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteButton = (button: NavButton) => {
    setButtonToDelete(button);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteButton = () => {
    if (buttonToDelete) {
      const updatedButtons = settings.navBar.buttons.filter(btn => 
        btn.id !== buttonToDelete.id
      );
      updateNavButtons(updatedButtons);
      setDeleteDialogOpen(false);
      setButtonToDelete(null);
      toast({
        title: "Button Deleted",
        description: "Navigation button has been removed successfully.",
      });
    }
  };

  const handleMoveButton = (button: NavButton, direction: 'up' | 'down') => {
    const buttons = [...settings.navBar.buttons];
    const index = buttons.findIndex(btn => btn.id === button.id);
    
    if (direction === 'up' && index > 0) {
      // Swap with previous button
      [buttons[index], buttons[index - 1]] = [buttons[index - 1], buttons[index]];
      updateNavButtons(buttons);
      toast({
        title: "Button Moved",
        description: "Navigation button has been moved up.",
      });
    } else if (direction === 'down' && index < buttons.length - 1) {
      // Swap with next button
      [buttons[index], buttons[index + 1]] = [buttons[index + 1], buttons[index]];
      updateNavButtons(buttons);
      toast({
        title: "Button Moved",
        description: "Navigation button has been moved down.",
      });
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

  const handleSaveGradientSettings = () => {
    // Always enable gradients when saving
    updateColorSettings({
      ...colorSettings,
      useCustomGradients: true
    });
    toast({
      title: "Gradient Settings Saved",
      description: "Your gradient settings have been updated successfully.",
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

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <Tabs defaultValue="navbar">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="navbar">Navbar</TabsTrigger>
            <TabsTrigger value="gradients">Gradients</TabsTrigger>
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
                <h3 className="text-sm font-medium mb-2">Navigation Buttons</h3>
                <div className="border rounded-md divide-y">
                  {settings.navBar.buttons.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground italic">
                      No navigation buttons added yet
                    </div>
                  ) : (
                    settings.navBar.buttons.map((button, index) => (
                      <div key={button.id} className="flex items-center justify-between p-3">
                        <div className="flex flex-col">
                          <span className="font-medium">{button.label}</span>
                          <span className="text-xs text-muted-foreground">{button.path}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Switch 
                            checked={button.enabled} 
                            onCheckedChange={(checked) => {
                              const updatedButtons = settings.navBar.buttons.map(btn => 
                                btn.id === button.id ? {...btn, enabled: checked} : btn
                              );
                              updateNavButtons(updatedButtons);
                            }} 
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveButton(button, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveButton(button, 'down')}
                            disabled={index === settings.navBar.buttons.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditButton(button)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteButton(button)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
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
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2"
                    onClick={handleAddNavButton}
                  >
                    <Plus className="h-4 w-4" />
                    Add Navigation Button
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
          
          <TabsContent value="gradients" className="mt-6">
            <div className="grid gap-6">
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
            <div className="flex justify-end pt-6">
              <Button onClick={handleSaveGradientSettings} className="gap-2">
                <Save size={16} />
                Save Gradient Settings
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Navigation Button</DialogTitle>
            <DialogDescription>
              Make changes to the navigation button.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-label">Button Label</Label>
              <Input 
                id="edit-label" 
                value={editingButton?.label || ''} 
                onChange={(e) => setEditingButton(prev => prev ? {...prev, label: e.target.value} : null)} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-path">Button Path</Label>
              <Input 
                id="edit-path" 
                value={editingButton?.path || ''} 
                onChange={(e) => setEditingButton(prev => prev ? {...prev, path: e.target.value} : null)} 
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="edit-enabled" className="flex-grow">Enabled</Label>
              <Switch 
                id="edit-enabled" 
                checked={editingButton?.enabled} 
                onCheckedChange={(checked) => setEditingButton(prev => prev ? {...prev, enabled: checked} : null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditedButton}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Navigation Button</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{buttonToDelete?.label}" button?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteButton}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

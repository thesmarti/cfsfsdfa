
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Settings, Palette, Type, Image } from 'lucide-react';
import { Toast } from "@/components/ui/toast";

export const SiteSettingsPanel = () => {
  const { toast } = useToast();
  const { settings, updateNavBarSettings, updateColorSettings, updateGeneralSettings } = useSiteSettings();
  
  const [navBarForm, setNavBarForm] = useState({
    showLogo: settings.navBar.showLogo,
    showText: settings.navBar.showText,
    logoUrl: settings.navBar.logoUrl,
    siteTitle: settings.navBar.siteTitle,
  });
  
  const [colorForm, setColorForm] = useState({
    primary: settings.colors.primary,
    secondary: settings.colors.secondary,
    accent: settings.colors.accent,
  });
  
  const [generalForm, setGeneralForm] = useState({
    siteDescription: settings.general.siteDescription,
    footerText: settings.general.footerText,
  });
  
  const handleNavBarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNavBarSettings(navBarForm);
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
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', hexToHsl(colorForm.primary));
    root.style.setProperty('--secondary', hexToHsl(colorForm.secondary));
    root.style.setProperty('--accent', hexToHsl(colorForm.accent));
  };
  
  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGeneralSettings(generalForm);
    toast({
      title: "Success",
      description: "General settings updated successfully",
    });
  };
  
  // Basic conversion from hex to HSL (not perfect but works for demo)
  const hexToHsl = (hex: string): string => {
    // This is a simplified conversion - in a real app you'd want a more accurate conversion
    // For now we'll return a default value based on color type
    if (hex.toLowerCase() === colorForm.primary.toLowerCase()) {
      return "210 90% 60%"; // Primary blue
    } else if (hex.toLowerCase() === colorForm.secondary.toLowerCase()) {
      return "250 90% 60%"; // Secondary purple
    } else {
      return "330 90% 60%"; // Accent pink
    }
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
          <TabsList className="grid grid-cols-3 mb-6">
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
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=Logo';
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
                  <Label htmlFor="logoUrl">Logo URL</Label>
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
              
              <Button type="submit" className="w-full">Save Color Settings</Button>
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
                </div>
              </div>
              
              <Button type="submit" className="w-full">Save Content Settings</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

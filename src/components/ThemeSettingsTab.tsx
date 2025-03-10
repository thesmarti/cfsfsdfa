
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormLabel } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { GradientPresets } from "@/components/GradientPresets";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Check, AlertTriangle, Menu, Search, Tag } from 'lucide-react';

export function ThemeSettingsTab() {
  const { toast } = useToast();
  const { settings, updateNavBarSettings, updateColorSettings, applyUIGradient } = useSiteSettings();
  const [particlesColor, setParticlesColor] = useState(settings.navBar.particlesColor || '#ffffff');
  const [particlesDensity, setParticlesDensity] = useState(settings.navBar.particlesDensity || 50);
  const [tagline, setTagline] = useState(settings.navBar.tagline || 'Save Money with Premium Coupon Codes');
  
  const handleSaveParticlesSettings = () => {
    updateNavBarSettings({
      particlesColor,
      particlesDensity: Number(particlesDensity),
    });
    
    toast({
      title: "Settings saved",
      description: "Particles settings have been updated.",
    });
  };
  
  const handleToggleParticles = (enabled: boolean) => {
    updateNavBarSettings({
      enableParticles: enabled,
    });
  };

  const handleNavStyleChange = (style: 'default' | 'centered') => {
    updateNavBarSettings({
      navStyle: style,
      tagline: tagline,
    });
    
    toast({
      title: "Navbar style updated",
      description: `Navigation style has been changed to ${style}.`,
    });
  };
  
  const handleTaglineChange = () => {
    updateNavBarSettings({
      tagline: tagline,
    });
    
    toast({
      title: "Tagline updated",
      description: "Your navbar tagline has been updated.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Theme Settings</h2>
        <p className="text-muted-foreground mb-6">
          Customize your site's appearance and branding
        </p>
      </div>
      
      <Tabs defaultValue="theme">
        <TabsList className="mb-6 grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="navbar">Navigation</TabsTrigger>
          <TabsTrigger value="gradients">Gradients</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme">
          <Card>
            <CardContent className="pt-6">
              <ThemeSelector />
              
              <Alert className="mt-8">
                <AlertTriangle className="w-4 h-4" />
                <AlertTitle>Theme Preview</AlertTitle>
                <AlertDescription>
                  This preview shows how your site's theme settings will appear to users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="navbar">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Navigation Bar Style</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Default navbar style option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      settings.navBar.navStyle === 'default' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => handleNavStyleChange('default')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Default Style</span>
                      {settings.navBar.navStyle === 'default' && (
                        <Check size={16} className="text-primary" />
                      )}
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Tag size={18} />
                          <span className="font-medium">Brand</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Home</Button>
                          <Button variant="ghost" size="sm">About</Button>
                          <Search size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Centered navbar style option */}
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      settings.navBar.navStyle === 'centered' 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => handleNavStyleChange('centered')}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Centered Style</span>
                      {settings.navBar.navStyle === 'centered' && (
                        <Check size={16} className="text-primary" />
                      )}
                    </div>
                    <div className="bg-card p-4 rounded-md border">
                      <div className="flex flex-col items-center">
                        <Tag size={32} className="mb-2" />
                        <span className="font-medium mb-1">Brand Name</span>
                        <span className="text-xs text-muted-foreground mb-2">{tagline}</span>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button variant="outline" size="sm">Home</Button>
                          <Button variant="ghost" size="sm">About</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {settings.navBar.navStyle === 'centered' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Tagline</h3>
                  <div className="flex gap-3">
                    <Input 
                      value={tagline} 
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Enter your tagline"
                      className="flex-1"
                    />
                    <Button onClick={handleTaglineChange}>Save</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gradients">
          <Card>
            <CardContent className="pt-6">
              <FormLabel className="text-lg mb-4 block">UI Gradient</FormLabel>
              <p className="text-muted-foreground mb-6">
                This gradient will be used for buttons, badges, and other UI elements.
              </p>
              
              <GradientPresets 
                presets={settings.colors.gradientPresets} 
                selectedPreset={settings.colors.uiGradient}
                onSelectPreset={(preset) => {
                  applyUIGradient(preset);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium">Background Particles</h3>
                  <p className="text-muted-foreground mt-1">
                    Add ambient particles to the navbar background
                  </p>
                </div>
                <Switch 
                  checked={settings.navBar.enableParticles} 
                  onCheckedChange={handleToggleParticles}
                />
              </div>
              
              {settings.navBar.enableParticles && (
                <div className="space-y-4 mt-4">
                  <div>
                    <FormLabel className="text-sm">Particles Color</FormLabel>
                    <div className="flex mt-1.5">
                      <Input 
                        type="color" 
                        value={particlesColor}
                        onChange={(e) => setParticlesColor(e.target.value)}
                        className="w-12 h-10 p-1 mr-2"
                      />
                      <Input 
                        type="text"
                        value={particlesColor}
                        onChange={(e) => setParticlesColor(e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel className="text-sm">Particles Density</FormLabel>
                    <div className="flex items-center mt-1.5">
                      <span className="text-sm mr-2">Low</span>
                      <Input
                        type="range"
                        min="10"
                        max="100"
                        value={particlesDensity}
                        onChange={(e) => setParticlesDensity(Number(e.target.value))}
                        className="mx-2 flex-1"
                      />
                      <span className="text-sm ml-2">High</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveParticlesSettings} className="mt-2">
                    Save Particles Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

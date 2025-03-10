
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { ThemeSelector } from './ThemeSelector';
import { GradientPresets } from './GradientPresets';
import { 
  Palette, 
  Sliders, 
  AlertCircle, 
  Info, 
  LayoutGrid, 
  Shuffle, 
  Check, 
  BrainCircuit, 
  Sparkles 
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { GradientPreset } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const ThemeSettingsTab = () => {
  const { settings, updateSettings } = useSiteSettings();
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState('system');
  
  // Navbar options state
  const [navStyle, setNavStyle] = useState(settings.navBar.navStyle);
  const [tagline, setTagline] = useState(settings.navBar.tagline);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState('navbar');
  
  // Gradient states
  const [uiGradient, setUiGradient] = useState(settings.colors.uiGradient);
  
  const gradientPresets: GradientPreset[] = [
    {
      id: '1',
      name: 'Cosmic Fusion',
      value: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      category: 'vibrant'
    },
    {
      id: '2',
      name: 'Ocean Breeze',
      value: 'bg-gradient-to-r from-cyan-500 to-blue-500',
      category: 'cool'
    },
    {
      id: '3',
      name: 'Sunset Vibes',
      value: 'bg-gradient-to-r from-orange-500 to-pink-500',
      category: 'warm'
    },
    {
      id: '4',
      name: 'Forest Mystique',
      value: 'bg-gradient-to-r from-emerald-500 to-teal-700',
      category: 'nature'
    },
    {
      id: '5',
      name: 'Royal Purple',
      value: 'bg-gradient-to-r from-indigo-700 to-purple-800',
      category: 'elegant'
    },
    {
      id: '6',
      name: 'Midnight Spark',
      value: 'bg-gradient-to-r from-gray-900 to-slate-800',
      category: 'dark'
    },
    {
      id: '7',
      name: 'Sunny Day',
      value: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      category: 'bright'
    },
    {
      id: '8',
      name: 'Berry Fusion',
      value: 'bg-gradient-to-r from-fuchsia-600 to-pink-600',
      category: 'vibrant'
    }
  ];

  // Theme management
  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    
    // Here you would typically set the theme in localStorage or context
    // and update any document classes needed for the theme to take effect
    
    toast({
      title: "Theme Updated",
      description: `The site theme has been set to ${theme.charAt(0).toUpperCase() + theme.slice(1)}.`,
    });
  };
  
  const handleNavStyleChange = (style: 'default' | 'centered') => {
    setNavStyle(style);
    updateSettings({
      ...settings,
      navBar: {
        ...settings.navBar,
        navStyle: style
      }
    });
    
    toast({
      title: "Navigation Style Updated",
      description: `The navigation style has been set to ${style}.`,
    });
  };
  
  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagline(e.target.value);
  };
  
  const saveTagline = () => {
    updateSettings({
      ...settings,
      navBar: {
        ...settings.navBar,
        tagline
      }
    });
    
    toast({
      title: "Tagline Updated",
      description: "The site tagline has been updated successfully.",
    });
  };
  
  const handleSelectGradient = (preset: GradientPreset) => {
    setUiGradient(preset.value);
    
    updateSettings({
      ...settings,
      colors: {
        ...settings.colors,
        uiGradient: preset.value
      }
    });
  };
  
  const applyGradientToAll = (preset: GradientPreset) => {
    updateSettings({
      ...settings,
      colors: {
        ...settings.colors,
        defaultGradient: preset.value,
        fashionGradient: preset.value,
        foodGradient: preset.value,
        electronicsGradient: preset.value,
        travelGradient: preset.value,
        beautyGradient: preset.value,
        homeGradient: preset.value,
        uiGradient: preset.value
      }
    });
  };
  
  const applyGradientToUI = (preset: GradientPreset) => {
    setUiGradient(preset.value);
    
    updateSettings({
      ...settings,
      colors: {
        ...settings.colors,
        uiGradient: preset.value
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Theme Settings</h2>
          <p className="text-muted-foreground">
            Customize the appearance of your coupon website.
          </p>
        </div>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-3 mb-8">
          <TabsTrigger value="navbar" className="flex items-center gap-2">
            <LayoutGrid size={16} />
            <span>Navigation</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette size={16} />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Sliders size={16} />
            <span>Theme</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Select a theme mode for your website. This determines the default appearance for all users.
            </AlertDescription>
          </Alert>

          <ThemeSelector 
            currentTheme={currentTheme}
            onThemeChange={handleThemeChange}
          />
        </TabsContent>
        
        <TabsContent value="navbar" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="navStyle">Navigation Style</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">About Navigation Styles</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose between different navigation bar layouts. The Default style shows the navigation horizontally, while the Centered style places your logo and tagline prominently above the navigation.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`border p-4 rounded-lg cursor-pointer hover:border-primary transition-all ${
                    navStyle === 'default' ? 'border-2 border-primary' : ''
                  }`}
                  onClick={() => handleNavStyleChange('default')}
                >
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 flex items-center px-4">
                    <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-400 dark:bg-gray-500 ml-3 rounded"></div>
                    <div className="ml-auto flex gap-3">
                      <div className="h-4 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
                      <div className="h-4 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
                      <div className="h-4 w-16 bg-gray-400 dark:bg-gray-500 rounded"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col justify-center items-center p-4">
                    <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Default</span>
                    {navStyle === 'default' && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                </div>
                
                <div 
                  className={`border p-4 rounded-lg cursor-pointer hover:border-primary transition-all ${
                    navStyle === 'centered' ? 'border-2 border-primary' : ''
                  }`}
                  onClick={() => handleNavStyleChange('centered')}
                >
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md mb-2 flex flex-col justify-center items-center">
                    <div className="w-12 h-12 bg-gray-400 dark:bg-gray-500 rounded-full mb-2"></div>
                    <div className="h-3 w-32 bg-gray-400 dark:bg-gray-500 rounded mb-1"></div>
                    <div className="flex gap-3 mt-2">
                      <div className="h-3 w-12 bg-gray-400 dark:bg-gray-500 rounded"></div>
                      <div className="h-3 w-12 bg-gray-400 dark:bg-gray-500 rounded"></div>
                      <div className="h-3 w-12 bg-gray-400 dark:bg-gray-500 rounded"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col justify-center items-center p-4">
                    <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Centered</span>
                    {navStyle === 'centered' && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {navStyle === 'centered' && (
              <div className="space-y-2">
                <Label htmlFor="tagline">Site Tagline</Label>
                <div className="flex gap-2">
                  <Input 
                    id="tagline" 
                    value={tagline} 
                    onChange={handleTaglineChange}
                    placeholder="Enter a catchy tagline for your site"
                  />
                  <Button onClick={saveTagline} className="shrink-0">Save</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  This tagline appears below your logo in the centered navigation style.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">UI Gradient</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-8 gap-1"
                    onClick={() => {
                      const randomPreset = gradientPresets[Math.floor(Math.random() * gradientPresets.length)];
                      handleSelectGradient(randomPreset);
                    }}
                  >
                    <Shuffle size={14} />
                    <span>Random</span>
                  </Button>
                </div>
              </div>
              
              <div>
                <div className={`h-20 w-full rounded-lg mb-4 ${uiGradient}`}></div>
              </div>
              
              <GradientPresets 
                presets={gradientPresets} 
                selectedValue={uiGradient} 
                onSelectPreset={handleSelectGradient}
                onApplyToAll={applyGradientToAll}
                onApplyToUI={applyGradientToUI}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy, Trash, AlertCircle, Edit, ArrowUpCircle, Plus, Image, Palette } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { NavButton } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { SeoSettingsTab } from './SeoSettingsTab';

export const SiteSettingsPanel = () => {
  const { settings, updateNavBarSettings, updateColorSettings, updateGeneralSettings, updateNavButtons } = useSiteSettings();
  const { toast } = useToast();
  const [newButtonLabel, setNewButtonLabel] = useState('');
  const [newButtonPath, setNewButtonPath] = useState('');

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
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="show-text">Show Text</Label>
                <Switch id="show-text" checked={settings.navBar.showText} onCheckedChange={(checked) => updateNavBarSettings({ showText: checked })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="site-title">Site Title</Label>
                <Input id="site-title" value={settings.navBar.siteTitle} onChange={handleSiteTitleChange} />
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

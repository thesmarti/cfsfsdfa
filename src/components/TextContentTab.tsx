
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SiteSettings } from '@/types';
import { Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const TextContentTab = () => {
  const { settings, updateTextContent } = useSiteSettings();
  const { toast } = useToast();
  const [textContent, setTextContent] = useState<SiteSettings['textContent']>({
    ...settings.textContent
  });
  
  // Update local state when settings change
  useEffect(() => {
    setTextContent({...settings.textContent});
  }, [settings.textContent]);

  const handleInputChange = (key: keyof SiteSettings['textContent'], value: string) => {
    setTextContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (section: 'hero' | 'headings' | 'ui') => {
    const sectionMap = {
      hero: ['heroTitle', 'heroSubtitle'],
      headings: ['featuredDealsTitle', 'allCouponsTitle', 'categoriesSectionTitle'],
      ui: ['ctaButtonText', 'noResultsText', 'searchPlaceholder']
    };
    
    const sectionData = Object.fromEntries(
      Object.entries(textContent).filter(([key]) => 
        sectionMap[section].includes(key as string)
      )
    );
    
    updateTextContent(sectionData as Partial<SiteSettings['textContent']>);
    
    toast({
      title: 'Success',
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} section has been updated.`,
    });
  };

  const handleSaveAll = () => {
    updateTextContent(textContent);
    toast({
      title: 'Success',
      description: 'All text content settings have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Note: Settings changes are temporary and not synced across devices. They will only be visible in your current browser session.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Customize the main hero section text that appears at the top of your homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={textContent.heroTitle}
              onChange={(e) => handleInputChange('heroTitle', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={textContent.heroSubtitle}
              onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => handleSave('hero')} className="gap-2">
            <Save size={16} />
            Save Hero Section
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Section Headings</CardTitle>
          <CardDescription>
            Customize the headings for various sections of your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="featuredDealsTitle">Featured Deals Section Title</Label>
            <Input
              id="featuredDealsTitle"
              value={textContent.featuredDealsTitle}
              onChange={(e) => handleInputChange('featuredDealsTitle', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="allCouponsTitle">All Coupons Section Title</Label>
            <Input
              id="allCouponsTitle"
              value={textContent.allCouponsTitle}
              onChange={(e) => handleInputChange('allCouponsTitle', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoriesSectionTitle">Categories Section Title</Label>
            <Input
              id="categoriesSectionTitle"
              value={textContent.categoriesSectionTitle}
              onChange={(e) => handleInputChange('categoriesSectionTitle', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => handleSave('headings')} className="gap-2">
            <Save size={16} />
            Save Headings
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>UI Text Elements</CardTitle>
          <CardDescription>
            Customize various text elements throughout the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="ctaButtonText">CTA Button Text</Label>
            <Input
              id="ctaButtonText"
              value={textContent.ctaButtonText}
              onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="noResultsText">No Results Text</Label>
            <Input
              id="noResultsText"
              value={textContent.noResultsText}
              onChange={(e) => handleInputChange('noResultsText', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="searchPlaceholder">Search Placeholder</Label>
            <Input
              id="searchPlaceholder"
              value={textContent.searchPlaceholder}
              onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => handleSave('ui')} className="gap-2">
            <Save size={16} />
            Save UI Text
          </Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setTextContent({...settings.textContent})}>
          Reset Changes
        </Button>
        <Button onClick={handleSaveAll} className="gap-2">
          <Save size={16} />
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

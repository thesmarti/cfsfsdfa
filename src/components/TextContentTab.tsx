
import { useState, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SiteSettings } from '@/types';
import { Save, CloudUpload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

export const TextContentTab = () => {
  const { settings, updateTextContent } = useSiteSettings();
  const { toast } = useToast();
  const [textContent, setTextContent] = useState<SiteSettings['textContent']>({
    ...settings.textContent
  });
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Update local state when settings change
  useEffect(() => {
    console.log('Settings textContent updated:', settings.textContent);
    setTextContent({...settings.textContent});
  }, [settings.textContent]);

  // Load settings from Supabase on component mount
  useEffect(() => {
    const loadSettingsFromSupabase = async () => {
      setIsSyncing(true);
      try {
        console.log('Loading settings from Supabase');
        const { data, error } = await supabase
          .from('site_settings')
          .select('text_content')
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          throw error;
        }
        
        if (data?.text_content) {
          console.log('Loaded text content:', data.text_content);
          
          // Safely handle the text_content data from Supabase
          const textContentData = data.text_content as Record<string, unknown>;
          
          // Create a properly typed object with defaults for missing properties
          const typedTextContent: SiteSettings['textContent'] = {
            heroTitle: typeof textContentData.heroTitle === 'string' ? textContentData.heroTitle : '',
            heroSubtitle: typeof textContentData.heroSubtitle === 'string' ? textContentData.heroSubtitle : '',
            featuredDealsTitle: typeof textContentData.featuredDealsTitle === 'string' ? textContentData.featuredDealsTitle : '',
            allCouponsTitle: typeof textContentData.allCouponsTitle === 'string' ? textContentData.allCouponsTitle : '',
            categoriesSectionTitle: typeof textContentData.categoriesSectionTitle === 'string' ? textContentData.categoriesSectionTitle : '',
            ctaButtonText: typeof textContentData.ctaButtonText === 'string' ? textContentData.ctaButtonText : '',
            noResultsText: typeof textContentData.noResultsText === 'string' ? textContentData.noResultsText : '',
            searchPlaceholder: typeof textContentData.searchPlaceholder === 'string' ? textContentData.searchPlaceholder : ''
          };
          
          setTextContent(typedTextContent);
          
          // Update the global state
          updateTextContent(typedTextContent);
        } else if (error && error.code === 'PGRST116') {
          // If no settings exist yet, create a default one
          console.log('No settings found, will use default values');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings from Supabase.',
          variant: 'destructive',
        });
      } finally {
        setIsSyncing(false);
      }
    };

    loadSettingsFromSupabase();
  }, []);

  const handleInputChange = (key: keyof SiteSettings['textContent'], value: string) => {
    setTextContent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettingsToSupabase = async (content: Partial<SiteSettings['textContent']>) => {
    setIsSyncing(true);
    try {
      console.log('Saving text content to Supabase:', content);
      
      // Ensure content has all required properties
      const safeContent: SiteSettings['textContent'] = {
        heroTitle: content.heroTitle || textContent.heroTitle || '',
        heroSubtitle: content.heroSubtitle || textContent.heroSubtitle || '',
        featuredDealsTitle: content.featuredDealsTitle || textContent.featuredDealsTitle || '',
        allCouponsTitle: content.allCouponsTitle || textContent.allCouponsTitle || '',
        categoriesSectionTitle: content.categoriesSectionTitle || textContent.categoriesSectionTitle || '',
        ctaButtonText: content.ctaButtonText || textContent.ctaButtonText || '',
        noResultsText: content.noResultsText || textContent.noResultsText || '',
        searchPlaceholder: content.searchPlaceholder || textContent.searchPlaceholder || ''
      };
      
      // Update using our site settings hook which will handle the Supabase integration
      await updateTextContent(safeContent);
      
      toast({
        title: 'Success',
        description: 'Text content saved and synced across all devices.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async (section: 'hero' | 'headings' | 'ui') => {
    const sectionMap = {
      hero: ['heroTitle', 'heroSubtitle'],
      headings: ['featuredDealsTitle', 'allCouponsTitle', 'categoriesSectionTitle'],
      ui: ['ctaButtonText', 'noResultsText', 'searchPlaceholder']
    };
    
    const sectionData = Object.fromEntries(
      Object.entries(textContent).filter(([key]) => 
        sectionMap[section].includes(key as string)
      )
    ) as Partial<SiteSettings['textContent']>;
    
    await saveSettingsToSupabase(sectionData);
  };

  const handleSaveAll = async () => {
    await saveSettingsToSupabase(textContent);
  };

  return (
    <div className="space-y-6">
      <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
        <AlertDescription className="flex items-center gap-2">
          <CloudUpload size={18} />
          Settings are now saved to Supabase and will be synced across all devices.
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
          <Button onClick={() => handleSave('hero')} disabled={isSyncing} className="gap-2">
            <Save size={16} />
            {isSyncing ? 'Saving...' : 'Save Hero Section'}
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
          <Button onClick={() => handleSave('headings')} disabled={isSyncing} className="gap-2">
            <Save size={16} />
            {isSyncing ? 'Saving...' : 'Save Headings'}
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
          <Button onClick={() => handleSave('ui')} disabled={isSyncing} className="gap-2">
            <Save size={16} />
            {isSyncing ? 'Saving...' : 'Save UI Text'}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setTextContent({...settings.textContent})} disabled={isSyncing}>
          Reset Changes
        </Button>
        <Button onClick={handleSaveAll} disabled={isSyncing} className="gap-2">
          <Save size={16} />
          {isSyncing ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
};

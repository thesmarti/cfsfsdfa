
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useToast } from "@/components/ui/use-toast";
import { Image, ArrowUpCircle } from 'lucide-react';

export const SeoSettingsTab = () => {
  const { settings, updateSeoSettings, uploadFavicon } = useSiteSettings();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSeoSettings({ title: e.target.value });
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSeoSettings({ description: e.target.value });
  };
  
  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      await uploadFavicon(file);
      toast({
        title: "Favicon updated",
        description: "Your favicon has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error uploading favicon",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="seo-title">Page Title (SEO)</Label>
              <Input
                id="seo-title"
                placeholder="Site Title for SEO"
                value={settings.seo?.title || ''}
                onChange={handleTitleChange}
              />
              <p className="text-xs text-muted-foreground">
                This is the title that appears in search engine results and browser tabs.
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                placeholder="Enter a description for search engines"
                value={settings.seo?.description || ''}
                onChange={handleDescriptionChange}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                A brief description of your site that appears in search engine results.
                Keep it under 160 characters for optimal display in search results.
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label>Favicon</Label>
              <div className="flex items-start gap-4">
                <div className="border rounded-md p-2 bg-muted/50 w-20 h-20 flex items-center justify-center">
                  {settings.seo?.favicon ? (
                    <img 
                      src={settings.seo.favicon} 
                      alt="Favicon" 
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
                      onClick={() => document.getElementById('favicon-upload')?.click()}
                    >
                      <ArrowUpCircle size={16} />
                      {isUploading ? 'Uploading...' : 'Upload Favicon'}
                    </Button>
                    <Input
                      id="favicon-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/gif, image/x-icon, image/svg+xml"
                      className="hidden"
                      onChange={handleFaviconUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 32x32 or 64x64 pixels. Supported formats: PNG, JPG, GIF, ICO, SVG.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

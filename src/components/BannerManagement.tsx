
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Image, Edit } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface BannerSetting {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  is_active: boolean;
}

const BannerManagement = () => {
  const { toast } = useToast();
  const [bannerSettings, setBannerSettings] = useState<BannerSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingImages, setEditingImages] = useState<string[]>([]);

  useEffect(() => {
    fetchBannerSettings();
  }, []);

  const fetchBannerSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching banner settings:', error);
        toast({
          title: "Error",
          description: "Failed to fetch banner settings",
          variant: "destructive",
        });
        return;
      }

      setBannerSettings(data);
      setEditingImages(data.image_url ? [data.image_url] : []);
    } catch (error) {
      console.error('Error fetching banner settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banner settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!bannerSettings) return;

    setSaving(true);
    try {
      const updatedSettings = {
        ...bannerSettings,
        image_url: editingImages.length > 0 ? editingImages[0] : bannerSettings.image_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('banner_settings')
        .update(updatedSettings)
        .eq('id', bannerSettings.id);

      if (error) {
        throw error;
      }

      setBannerSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Banner settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating banner settings:', error);
      toast({
        title: "Error",
        description: "Failed to update banner settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof BannerSetting, value: string | boolean) => {
    if (!bannerSettings) return;
    
    setBannerSettings({
      ...bannerSettings,
      [field]: value,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading banner settings...</div>
      </div>
    );
  }

  if (!bannerSettings) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">Failed to load banner settings</div>
        <Button onClick={fetchBannerSettings} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Image className="h-5 w-5" />
          <span>Banner Management</span>
        </CardTitle>
        <CardDescription>
          Manage the hero banner that appears on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Banner Image Upload */}
        <div className="space-y-2">
          <Label htmlFor="banner-image">Banner Image</Label>
          <ImageUpload
            images={editingImages}
            onImagesChange={setEditingImages}
            maxImages={1}
            maxSizePerImageMB={5}
          />
          <p className="text-sm text-gray-500">
            Recommended size: 1920x600px for optimal display
          </p>
        </div>

        {/* Title and Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Main Title (H1)</Label>
            <Input
              id="title"
              value={bannerSettings.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Authentic Flavors"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (H2)</Label>
            <Input
              id="subtitle"
              value={bannerSettings.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="e.g., Traditional Recipes"
            />
          </div>
        </div>

        {/* Button Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button-text">Primary Button Text</Label>
            <Input
              id="button-text"
              value={bannerSettings.button_text}
              onChange={(e) => handleInputChange('button_text', e.target.value)}
              placeholder="e.g., Shop Now"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="button-link">Primary Button Link</Label>
            <Input
              id="button-link"
              value={bannerSettings.button_link}
              onChange={(e) => handleInputChange('button_link', e.target.value)}
              placeholder="e.g., /shop"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
            <Input
              id="secondary-button-text"
              value={bannerSettings.secondary_button_text}
              onChange={(e) => handleInputChange('secondary_button_text', e.target.value)}
              placeholder="e.g., Our Story"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
            <Input
              id="secondary-button-link"
              value={bannerSettings.secondary_button_link}
              onChange={(e) => handleInputChange('secondary_button_link', e.target.value)}
              placeholder="e.g., /about"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="is-active"
            checked={bannerSettings.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is-active">Show Banner on Homepage</Label>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerManagement;

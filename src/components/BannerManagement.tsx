
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Image, Edit, Plus, Trash, Move } from 'lucide-react';
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
  display_order: number;
  is_published: boolean;
}

const BannerManagement = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState<BannerSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSetting | null>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banner_settings')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching banners:', error);
        toast({
          title: "Error",
          description: "Failed to fetch banners",
          variant: "destructive",
        });
        return;
      }

      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: BannerSetting) => {
    setEditingBanner(banner);
    setEditingImages(banner.image_url ? [banner.image_url] : []);
  };

  const handleSave = async (banner: BannerSetting) => {
    setSaving(true);
    try {
      const updatedBanner = {
        ...banner,
        image_url: editingImages.length > 0 ? editingImages[0] : banner.image_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('banner_settings')
        .update(updatedBanner)
        .eq('id', banner.id);

      if (error) {
        throw error;
      }

      setBanners(banners.map(b => b.id === banner.id ? updatedBanner : b));
      setEditingBanner(null);
      setEditingImages([]);
      toast({
        title: "Success",
        description: "Banner updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating banner:', error);
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const maxOrder = Math.max(...banners.map(b => b.display_order), 0);
      const newBanner = {
        title: 'New Banner',
        subtitle: 'Banner Subtitle',
        image_url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&h=600&fit=crop',
        button_text: 'Shop Now',
        button_link: '/shop',
        secondary_button_text: 'Learn More',
        secondary_button_link: '/about',
        is_active: true,
        is_published: true,
        display_order: maxOrder + 1,
      };

      const { data, error } = await supabase
        .from('banner_settings')
        .insert([newBanner])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setBanners([...banners, data]);
      setIsCreating(false);
      toast({
        title: "Success",
        description: "Banner created successfully",
      });
    } catch (error: any) {
      console.error('Error creating banner:', error);
      toast({
        title: "Error",
        description: "Failed to create banner",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('banner_settings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setBanners(banners.filter(b => b.id !== id));
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const moveUp = async (banner: BannerSetting) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex <= 0) return;

    const previousBanner = banners[currentIndex - 1];
    const updates = [
      { id: banner.id, display_order: previousBanner.display_order },
      { id: previousBanner.id, display_order: banner.display_order }
    ];

    try {
      for (const update of updates) {
        await supabase
          .from('banner_settings')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
      await fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
    }
  };

  const moveDown = async (banner: BannerSetting) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex >= banners.length - 1) return;

    const nextBanner = banners[currentIndex + 1];
    const updates = [
      { id: banner.id, display_order: nextBanner.display_order },
      { id: nextBanner.id, display_order: banner.display_order }
    ];

    try {
      for (const update of updates) {
        await supabase
          .from('banner_settings')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }
      await fetchBanners();
    } catch (error) {
      console.error('Error reordering banners:', error);
    }
  };

  const handleInputChange = (field: keyof BannerSetting, value: string | boolean) => {
    if (!editingBanner) return;
    
    setEditingBanner({
      ...editingBanner,
      [field]: value,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading banners...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Banner Management</span>
            </CardTitle>
            <CardDescription>
              Manage multiple banners that appear on the homepage
            </CardDescription>
          </div>
          <Button onClick={handleCreate} disabled={saving}>
            <Plus className="h-4 w-4 mr-2" />
            Add Banner
          </Button>
        </CardHeader>
      </Card>

      {banners.map((banner, index) => (
        <Card key={banner.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Banner {index + 1}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveUp(banner)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveDown(banner)}
                  disabled={index === banners.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(banner)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(banner.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video w-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Title:</strong> {banner.title}
              </div>
              <div>
                <strong>Subtitle:</strong> {banner.subtitle}
              </div>
              <div>
                <strong>Active:</strong> {banner.is_active ? 'Yes' : 'No'}
              </div>
              <div>
                <strong>Published:</strong> {banner.is_published ? 'Yes' : 'No'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-2xl">
            <Card className="relative max-h-screen overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="banner-image">Banner Image</Label>
                  <ImageUpload
                    images={editingImages}
                    onImagesChange={setEditingImages}
                    maxImages={1}
                    maxSizePerImageMB={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Main Title (H1)</Label>
                    <Input
                      id="title"
                      value={editingBanner.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle (H2)</Label>
                    <Input
                      id="subtitle"
                      value={editingBanner.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button-text">Primary Button Text</Label>
                    <Input
                      id="button-text"
                      value={editingBanner.button_text}
                      onChange={(e) => handleInputChange('button_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button-link">Primary Button Link</Label>
                    <Input
                      id="button-link"
                      value={editingBanner.button_link}
                      onChange={(e) => handleInputChange('button_link', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
                    <Input
                      id="secondary-button-text"
                      value={editingBanner.secondary_button_text}
                      onChange={(e) => handleInputChange('secondary_button_text', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-button-link">Secondary Button Link</Label>
                    <Input
                      id="secondary-button-link"
                      value={editingBanner.secondary_button_link}
                      onChange={(e) => handleInputChange('secondary_button_link', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-active"
                      checked={editingBanner.is_active}
                      onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                    />
                    <Label htmlFor="is-active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-published"
                      checked={editingBanner.is_published}
                      onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                    />
                    <Label htmlFor="is-published">Published</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingBanner(null);
                      setEditingImages([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={() => handleSave(editingBanner)} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;

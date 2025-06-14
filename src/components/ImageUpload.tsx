
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizePerImageMB?: number;
}

const ImageUpload = ({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  maxSizePerImageMB = 2 
}: ImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const newImageUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Check file size
        if (file.size > maxSizePerImageMB * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds ${maxSizePerImageMB}MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error:', error);
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      if (newImageUrls.length > 0) {
        onImagesChange([...images, ...newImageUrls]);
        toast({
          title: "Success",
          description: `${newImageUrls.length} image(s) uploaded successfully`,
        });
      }

    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Product Images</Label>
        <div className="mt-2">
          <Input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading || images.length >= maxImages}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={uploading || images.length >= maxImages}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
          <p className="text-sm text-gray-500 mt-1">
            Max {maxImages} images, {maxSizePerImageMB}MB per image. {images.length}/{maxImages} uploaded.
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.png';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

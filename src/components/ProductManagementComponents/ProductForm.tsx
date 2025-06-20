
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

interface ProductFormProps {
  product: Product;
  images: string[];
  onProductChange: (product: Product) => void;
  onImagesChange: (images: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  saving?: boolean;
}

const ProductForm = ({ 
  product, 
  images, 
  onProductChange, 
  onImagesChange, 
  onSave, 
  onCancel, 
  isEditing,
  saving 
}: ProductFormProps) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <Card className="relative max-h-screen overflow-y-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="absolute top-2 right-2 z-10"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Product' : 'Create Product'}</CardTitle>
            <CardDescription>
              {isEditing ? 'Update product details' : 'Add a new product to your inventory'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <ImageUpload
                images={images}
                onImagesChange={onImagesChange}
                maxImages={5}
                maxSizePerImageMB={2}
              />
              
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => onProductChange({ ...product, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description || ''}
                  onChange={(e) => onProductChange({ ...product, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={product.price}
                    onChange={(e) => onProductChange({ ...product, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offer_price">Offer Price (₹)</Label>
                  <Input
                    id="offer_price"
                    type="number"
                    value={product.offer_price || ''}
                    onChange={(e) => onProductChange({ ...product, offer_price: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="Optional"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={product.stock_quantity || 0}
                    onChange={(e) => onProductChange({ ...product, stock_quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={product.category || ''} 
                    onValueChange={(value) => onProductChange({ ...product, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chicken">Chicken</SelectItem>
                      <SelectItem value="red_meat">Red Meat</SelectItem>
                      <SelectItem value="chilli_condiments">Chilli Condiments</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={product.featured || false}
                    onCheckedChange={(checked) => onProductChange({ ...product, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={product.is_active || false}
                    onCheckedChange={(checked) => onProductChange({ ...product, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active Product</Label>
                </div>
              </div>
              
              <Button onClick={onSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;

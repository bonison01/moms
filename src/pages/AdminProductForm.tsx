
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, X, Loader2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    ingredients: '',
    offers: '',
    stock_quantity: '',
    is_active: true,
    image_url: '',
    features: [''],
    nutrition_facts: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      sodium: ''
    }
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    setInitialLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
        navigate('/admin');
        return;
      }
      
      const nutritionFacts = data.nutrition_facts && typeof data.nutrition_facts === 'object' 
        ? {
            calories: (data.nutrition_facts as any).calories || '',
            protein: (data.nutrition_facts as any).protein || '',
            carbs: (data.nutrition_facts as any).carbs || '',
            fat: (data.nutrition_facts as any).fat || '',
            fiber: (data.nutrition_facts as any).fiber || '',
            sodium: (data.nutrition_facts as any).sodium || ''
          }
        : {
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            fiber: '',
            sodium: ''
          };
      
      setFormData({
        ...data,
        price: data.price.toString(),
        stock_quantity: data.stock_quantity.toString(),
        features: data.features && data.features.length > 0 ? data.features : [''],
        nutrition_facts: nutritionFacts
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product",
        variant: "destructive",
      });
      navigate('/admin');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length > 0 ? newFeatures : [''] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) {
        throw new Error('Valid stock quantity is required');
      }

      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim() || null,
        category: formData.category.trim() || null,
        ingredients: formData.ingredients.trim() || null,
        offers: formData.offers.trim() || null,
        stock_quantity: parseInt(formData.stock_quantity),
        is_active: formData.is_active,
        image_url: formData.image_url || null,
        features: formData.features.filter(f => f.trim() !== ''),
        nutrition_facts: formData.nutrition_facts,
        updated_at: new Date().toISOString()
      };

      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      navigate('/admin');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600 text-lg">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Update product information' : 'Create a new product for your catalog'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Snacks, Beverages"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Product is active</Label>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload a high-quality product image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center mt-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  )}
                </div>
                {formData.image_url && (
                  <div className="mt-4">
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description and Details */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>Detailed product information for customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <Label htmlFor="ingredients">Ingredients</Label>
                <Textarea
                  id="ingredients"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  rows={3}
                  placeholder="List the ingredients..."
                />
              </div>
              <div>
                <Label htmlFor="offers">Special Offers</Label>
                <Textarea
                  id="offers"
                  value={formData.offers}
                  onChange={(e) => setFormData({ ...formData, offers: e.target.value })}
                  rows={2}
                  placeholder="Any special offers or promotions..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Product Features</CardTitle>
              <CardDescription>Add key features and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter a feature"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    disabled={formData.features.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addFeature}>
                Add Feature
              </Button>
            </CardContent>
          </Card>

          {/* Nutrition Facts */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Facts</CardTitle>
              <CardDescription>Per serving nutritional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    value={formData.nutrition_facts.calories}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, calories: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    value={formData.nutrition_facts.protein}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, protein: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    value={formData.nutrition_facts.carbs}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, carbs: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    value={formData.nutrition_facts.fat}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, fat: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input
                    id="fiber"
                    value={formData.nutrition_facts.fiber}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, fiber: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="sodium">Sodium (mg)</Label>
                  <Input
                    id="sodium"
                    value={formData.nutrition_facts.sodium}
                    onChange={(e) => setFormData({
                      ...formData,
                      nutrition_facts: { ...formData.nutrition_facts, sodium: e.target.value }
                    })}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6">
            <Button type="submit" disabled={loading} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin')} size="lg">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;

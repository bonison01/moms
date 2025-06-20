import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Save, X, Package, LogOut, Home } from 'lucide-react';
import OrderManagement from '@/components/OrderManagement';
import BannerManagement from '@/components/BannerManagement';
import ImageUpload from '@/components/ImageUpload';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  features: string[] | null;
  ingredients: string | null;
  offers: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  featured: boolean | null;
}

const ProductManagement = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingImages, setEditingImages] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProductImages, setNewProductImages] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: null,
    price: 0,
    image_url: null,
    category: null,
    features: null,
    ingredients: null,
    offers: null,
    stock_quantity: null,
    is_active: null,
    featured: null,
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth?admin=true');
    }
  }, [user, isAdmin, loading, navigate]);

  // Fetch products
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    // Parse existing images - handle both single image_url and potential array
    const existingImages = product.image_url ? [product.image_url] : [];
    setEditingImages(existingImages);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditingImages([]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter((product) => product.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (updatedProduct: Product) => {
    try {
      // Use the first image as the main image_url for backward compatibility
      const productData = {
        ...updatedProduct,
        image_url: editingImages.length > 0 ? editingImages[0] : null,
      };

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', updatedProduct.id);

      if (error) throw error;

      setProducts(products.map((product) => (product.id === updatedProduct.id ? productData : product)));
      setEditingProduct(null);
      setEditingImages([]);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewProduct(prev => ({ ...prev, category: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };

  const handleCreate = async () => {
    try {
      const productData = {
        ...newProduct,
        image_url: newProductImages.length > 0 ? newProductImages[0] : null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) throw error;

      setProducts([...products, data[0]]);
      setIsCreating(false);
      setNewProductImages([]);
      setNewProduct({
        name: '',
        description: null,
        price: 0,
        image_url: null,
        category: null,
        features: null,
        ingredients: null,
        offers: null,
        stock_quantity: null,
        is_active: null,
        featured: null,
      });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your products, orders, and website content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
              <Button 
                onClick={handleSignOut} 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full py-6 px-4">
        <div className="w-full">
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="banner">Banner</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="banner">
              <BannerManagement />
            </TabsContent>

            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Product</span>
                </Button>
              </div>

              {loadingProducts ? (
                <div className="text-center">Loading products...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {product.name}
                          {product.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Price: ₹{product.price} | Stock: {product.stock_quantity || 0}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <img src={product.image_url || '/placeholder-image.png'} alt={product.name} className="w-full h-48 object-cover mb-4 rounded-md" />
                        <p className="text-sm text-gray-500">{product.description?.substring(0, 100)}...</p>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
              <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <Card className="relative max-h-screen overflow-y-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="absolute top-2 right-2 z-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update product details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <ImageUpload
                        images={editingImages}
                        onImagesChange={setEditingImages}
                        maxImages={5}
                        maxSizePerImageMB={2}
                      />
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock_quantity">Stock Quantity</Label>
                        <Input
                          id="stock_quantity"
                          type="number"
                          value={editingProduct.stock_quantity || 0}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={editingProduct.featured || false}
                          onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured Product</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_active"
                          checked={editingProduct.is_active || false}
                          onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Active Product</Label>
                      </div>
                      <Button onClick={() => handleUpdate(editingProduct)}>
                        <Save className="h-4 w-4 mr-2" />
                        Update Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Create Product Modal */}
          {isCreating && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
              <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <Card className="relative max-h-screen overflow-y-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false);
                      setNewProductImages([]);
                    }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader>
                    <CardTitle>Create Product</CardTitle>
                    <CardDescription>Add a new product to your inventory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <ImageUpload
                        images={newProductImages}
                        onImagesChange={setNewProductImages}
                        maxImages={5}
                        maxSizePerImageMB={2}
                      />
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Name</Label>
                        <Input
                          id="new-name"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-description">Description</Label>
                        <Textarea
                          id="new-description"
                          name="description"
                          value={newProduct.description || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-price">Price</Label>
                        <Input
                          id="new-price"
                          type="number"
                          name="price"
                          value={newProduct.price}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-category">Category</Label>
                        <Select onValueChange={handleSelectChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pickle">Pickle</SelectItem>
                            <SelectItem value="fish">Fish</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-stock_quantity">Stock Quantity</Label>
                        <Input
                          id="new-stock_quantity"
                          type="number"
                          name="stock_quantity"
                          value={newProduct.stock_quantity || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="new-featured"
                          type="checkbox"
                          name="featured"
                          checked={newProduct.featured || false}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="new-featured">Featured Product</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="new-is_active"
                          type="checkbox"
                          name="is_active"
                          checked={newProduct.is_active || false}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="new-is_active">Is Active</Label>
                      </div>
                      <Button onClick={handleCreate}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;


import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package, LogOut, Home } from 'lucide-react';
import OrderManagement from '@/components/OrderManagement';
import BannerManagement from '@/components/BannerManagement';
import ProductList from '@/components/ProductManagementComponents/ProductList';
import ProductForm from '@/components/ProductManagementComponents/ProductForm';
import { Product } from '@/types/product';

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
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    description: null,
    price: 0,
    offer_price: null,
    image_url: null,
    image_urls: null,
    category: null,
    features: null,
    ingredients: null,
    offers: null,
    stock_quantity: 0,
    is_active: true,
    featured: false,
    created_at: '',
    updated_at: '',
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
    const existingImages = [];
    if (product.image_url) existingImages.push(product.image_url);
    if (product.image_urls) existingImages.push(...product.image_urls);
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

  const handleUpdate = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        ...editingProduct,
        image_url: editingImages.length > 0 ? editingImages[0] : null,
        image_urls: editingImages.length > 1 ? editingImages.slice(1) : null,
      };

      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map((product) => (product.id === editingProduct.id ? productData : product)));
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

  const handleCreate = async () => {
    try {
      const productData = {
        ...newProduct,
        image_url: newProductImages.length > 0 ? newProductImages[0] : null,
        image_urls: newProductImages.length > 1 ? newProductImages.slice(1) : null,
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
        id: '',
        name: '',
        description: null,
        price: 0,
        offer_price: null,
        image_url: null,
        image_urls: null,
        category: null,
        features: null,
        ingredients: null,
        offers: null,
        stock_quantity: 0,
        is_active: true,
        featured: false,
        created_at: '',
        updated_at: '',
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

              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loadingProducts}
              />
            </TabsContent>
          </Tabs>

          {/* Edit Product Modal */}
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              images={editingImages}
              onProductChange={setEditingProduct}
              onImagesChange={setEditingImages}
              onSave={handleUpdate}
              onCancel={handleCancelEdit}
              isEditing={true}
            />
          )}

          {/* Create Product Modal */}
          {isCreating && (
            <ProductForm
              product={newProduct}
              images={newProductImages}
              onProductChange={setNewProduct}
              onImagesChange={setNewProductImages}
              onSave={handleCreate}
              onCancel={() => {
                setIsCreating(false);
                setNewProductImages([]);
              }}
              isEditing={false}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductManagement;

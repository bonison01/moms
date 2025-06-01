
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  image_url: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  ingredients: string | null;
  offers: string | null;
  features: string[] | null;
  nutrition_facts: any;
}

export const useProducts = (adminView = false) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [adminView]);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // For public view, only show active products
      if (!adminView) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Products fetched successfully:', data?.length || 0);
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products",
        variant: "destructive",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.map(p => 
        p.id === id ? { ...p, is_active: !currentStatus } : p
      ));
      
      toast({
        title: "Success",
        description: `Product ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    toggleProductStatus,
    deleteProduct
  };
};

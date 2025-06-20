
import { Product } from '@/types/product';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const ProductList = ({ products, onEdit, onDelete, loading }: ProductListProps) => {
  if (loading) {
    return <div className="text-center">Loading products...</div>;
  }

  return (
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
              <div className="space-y-1">
                <div>Price: ₹{product.price}</div>
                {product.offer_price && (
                  <div className="text-green-600">Offer: ₹{product.offer_price}</div>
                )}
                <div>Stock: {product.stock_quantity || 0}</div>
                <div>Category: {product.category || 'None'}</div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <img 
              src={product.image_url || '/placeholder-image.png'} 
              alt={product.name} 
              className="w-full h-48 object-cover mb-4 rounded-md" 
            />
            <p className="text-sm text-gray-500 mb-4">
              {product.description?.substring(0, 100)}...
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" size="sm" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductList;

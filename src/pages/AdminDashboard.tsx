
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { products, loading, toggleProductStatus, deleteProduct } = useProducts(true);

  console.log('AdminDashboard render - products:', products.length, 'loading:', loading);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link to="/admin/products/new">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Products</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : products.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Products</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : products.filter(p => p.is_active).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Low Stock</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : products.filter(p => p.stock_quantity < 10).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              View and manage all your products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-gray-600">Loading products...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">No Products Found</h3>
                <p className="text-gray-600 mb-8">
                  Get started by adding your first product to the catalog.
                </p>
                <Link to="/admin/products/new">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Your First Product</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category || 'Uncategorized'}</TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>
                          <span className={product.stock_quantity < 10 ? 'text-red-600 font-medium' : ''}>
                            {product.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.is_active ? "default" : "secondary"}
                            className="cursor-pointer hover:opacity-80"
                            onClick={() => toggleProductStatus(product.id, product.is_active)}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/product/${product.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/admin/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => deleteProduct(product.id)}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

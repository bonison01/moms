import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { Product } from '@/types/product';

interface CSVUploadProps {
  onProductsUploaded: (products: Product[]) => void;
}

interface ProductInsert {
  name: string;
  description?: string | null;
  price: number;
  offer_price?: number | null;
  category?: string | null;
  stock_quantity?: number | null;
  is_active?: boolean | null;
  featured?: boolean | null;
  features?: string[] | null;
  ingredients?: string | null;
  offers?: string | null;
  image_url?: string | null;
  image_urls?: string[] | null;
}

const CSVUpload = ({ onProductsUploaded }: CSVUploadProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = `name,description,price,offer_price,category,stock_quantity,is_active,featured,features,ingredients,offers
Premium Chicken Breast,Fresh premium chicken breast cuts,299.99,249.99,chicken,50,true,true,"High protein|Low fat|Fresh","Fresh chicken breast","Limited time offer"
Spicy Red Meat,Premium red meat with spices,499.99,,red_meat,30,true,false,"Premium quality|Spicy","Premium beef",""`

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/"/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/"/g, ''));
      
      return values;
    });

    return rows.map(row => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  };

  const processCSVData = (data: any[]): ProductInsert[] => {
    return data.map(row => ({
      name: row.name || '',
      description: row.description || null,
      price: parseFloat(row.price) || 0,
      offer_price: row.offer_price ? parseFloat(row.offer_price) : null,
      category: row.category || null,
      stock_quantity: parseInt(row.stock_quantity) || 0,
      is_active: row.is_active === 'true' || row.is_active === '1',
      featured: row.featured === 'true' || row.featured === '1',
      features: row.features ? row.features.split('|').filter(f => f.trim()) : null,
      ingredients: row.ingredients || null,
      offers: row.offers || null,
      image_url: null,
      image_urls: null,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!csvFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const csvText = await csvFile.text();
      const parsedData = parseCSV(csvText);
      const products = processCSVData(parsedData);

      // Validate required fields
      const invalidProducts = products.filter(p => !p.name || p.price <= 0);
      if (invalidProducts.length > 0) {
        throw new Error(`${invalidProducts.length} products have missing or invalid name/price`);
      }

      // Insert products into database
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (error) throw error;

      onProductsUploaded(data || []);
      setCsvFile(null);
      
      toast({
        title: "Success",
        description: `Successfully uploaded ${data?.length || 0} products`,
      });

      // Reset file input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Error uploading CSV:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload CSV file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Bulk Product Upload</span>
        </CardTitle>
        <CardDescription>
          Upload multiple products at once using a CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">CSV Format Requirements:</p>
            <p>Include headers: name, description, price, offer_price, category, stock_quantity, is_active, featured, features, ingredients, offers</p>
            <p>Separate multiple features with "|" (e.g., "High protein|Low fat")</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Template</span>
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {csvFile && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600">
              Selected file: <span className="font-medium">{csvFile.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              Size: {(csvFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!csvFile || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Products"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CSVUpload;


import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const products = [
    {
      id: 'beef-pickles',
      name: 'Traditional Beef Pickles',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
      description: 'Authentic beef pickles made with traditional spices and slow-cooked to perfection. Rich, savory flavors that complement any meal.'
    },
    {
      id: 'chicken-sinju',
      name: 'Chicken Sinju',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
      description: 'Our signature chicken sinju with aromatic herbs and traditional seasonings. A delicate balance of flavors in every bite.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our carefully crafted collection of traditional foods
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          {/* Coming Soon */}
          <div className="mt-16 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">More Products Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                We're constantly working on new flavors and products to add to our collection. 
                Stay tuned for exciting additions to the Momsgoogoo Foods family.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-orange-800 font-medium">
                  Sign up for our newsletter to be the first to know about new products!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;

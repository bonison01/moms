
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const products = [
    {
      id: 'seasoned-fermented-fish',
      name: 'Seasoned Fermented Fish',
      price: '$18.99',
      image: '/lovable-uploads/b4742f71-5f91-4c9b-8dfa-88d0e668b696.png',
      description: 'Ngari Angouba - Traditional seasoned fermented fish, roasted and ready to eat with authentic spices.'
    },
    {
      id: 'chicken-pickle',
      name: 'Chicken Pickle',
      price: '$15.99',
      image: '/lovable-uploads/5d3d1fda-566d-4288-867d-21ed4494e26f.png',
      description: 'A product of Manipur - Just like homemade chicken pickle with traditional spices and authentic flavors.'
    },
    {
      id: 'spicy-lentil-crisp',
      name: 'Spicy Lentil Crisp',
      price: '$12.99',
      image: '/lovable-uploads/8dae3250-8a46-444e-8b50-f50cf472cff8.png',
      description: 'Bori Mix - Crunchy spicy lentil crisps perfect as a snack or side dish with traditional meals.'
    },
    {
      id: 'spicy-soybean-crisp',
      name: 'Spicy Soybean Crisp',
      price: '$14.99',
      image: '/lovable-uploads/96a97ecf-07a2-4ca9-90c6-5bef5e37e2c2.png',
      description: 'Hawaijar Mix - Crispy spicy soybean mix with authentic traditional flavors and spices.'
    },
    {
      id: 'dry-chilli-chutney',
      name: 'Dry Chilli Chutney',
      price: '$11.99',
      image: '/lovable-uploads/96367fda-747a-4537-947c-446c43ab2308.png',
      description: 'Ametpa Mix with Ngari - Traditional dry chilli chutney with fermented fish, packed with authentic flavors.'
    },
    {
      id: 'spicy-stink-beans',
      name: 'Spicy Stink Beans',
      price: '$13.99',
      image: '/lovable-uploads/80957d89-ebbe-4a50-93ee-d05b8b7f70b5.png',
      description: 'Yongchak Maru Mix - Traditional spicy stink beans preparation with authentic Manipuri spices.'
    },
    {
      id: 'bamboo-shoot-chicken-pickle',
      name: 'Bamboo Shoot Chicken Pickle',
      price: '$16.99',
      image: '/lovable-uploads/02bd53a8-2cb2-4f88-8765-a8ac21aa2273.png',
      description: 'Premium bamboo shoot chicken pickle combining tender chicken with fresh bamboo shoots in traditional spices.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our carefully crafted collection of traditional foods
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          {/* Coming Soon */}
          <div className="mt-16 text-center">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md max-w-md mx-auto border border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4">More Products Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                We're constantly working on new flavors and products to add to our collection. 
                Stay tuned for exciting additions to the Momsgoogoo Foods family.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                <p className="text-black font-medium">
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

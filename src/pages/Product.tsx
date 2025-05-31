
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ShoppingCart } from 'lucide-react';

const Product = () => {
  const { id } = useParams();

  const products = {
    'beef-pickles': {
      name: 'Traditional Beef Pickles',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&h=600&fit=crop',
      description: 'Our traditional beef pickles are a labor of love, crafted using time-honored recipes and the finest ingredients. Each jar contains tender pieces of beef, slowly pickled with a blend of aromatic spices that create a rich, complex flavor profile.',
      ingredients: ['Premium beef', 'Traditional spice blend', 'Vinegar', 'Salt', 'Natural preservatives'],
      nutritionFacts: {
        servingSize: '2 oz (56g)',
        calories: '85',
        protein: '12g',
        sodium: '680mg'
      },
      features: [
        'Made with premium cuts of beef',
        'Traditional family recipe',
        'No artificial flavors or colors',
        'Small batch production',
        'Perfect with rice or bread'
      ]
    },
    'chicken-sinju': {
      name: 'Chicken Sinju',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600&h=600&fit=crop',
      description: 'Our signature Chicken Sinju represents the pinnacle of traditional cooking. Tender chicken pieces are carefully prepared with aromatic herbs and spices, creating a delicate yet flavorful dish that embodies authentic culinary craftsmanship.',
      ingredients: ['Free-range chicken', 'Aromatic herb blend', 'Traditional seasonings', 'Natural spices', 'Premium oils'],
      nutritionFacts: {
        servingSize: '3 oz (85g)',
        calories: '145',
        protein: '18g',
        sodium: '520mg'
      },
      features: [
        'Made with free-range chicken',
        'Signature herb and spice blend',
        'Traditional preparation method',
        'Rich in protein',
        'Versatile serving options'
      ]
    }
  };

  const product = products[id as keyof typeof products];

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <Link to="/shop" className="text-orange-600 hover:text-orange-700">
              Return to Shop
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to="/shop" className="text-orange-600 hover:text-orange-700">Shop</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-orange-600 mb-6">
                {product.price}
              </p>
              <p className="text-lg text-gray-600 mb-8">
                {product.description}
              </p>

              {/* Add to Cart */}
              <div className="flex items-center space-x-4 mb-8">
                <input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Product Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredients</h3>
                <p className="text-gray-600">
                  {product.ingredients.join(', ')}
                </p>
              </div>

              {/* Nutrition Facts */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Serving Size:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.servingSize}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Calories:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.calories}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Protein:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.protein}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Sodium:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.sodium}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Product;

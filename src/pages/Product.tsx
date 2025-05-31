
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ShoppingCart } from 'lucide-react';

const Product = () => {
  const { id } = useParams();

  const products = {
    'seasoned-fermented-fish': {
      name: 'Seasoned Fermented Fish',
      price: '$18.99',
      image: '/lovable-uploads/b4742f71-5f91-4c9b-8dfa-88d0e668b696.png',
      description: 'Ngari Angouba - Traditional seasoned fermented fish, roasted and ready to eat with authentic spices. A delicacy from Manipur prepared using traditional methods.',
      ingredients: ['Fermented fish', 'Traditional spice blend', 'Salt', 'Natural seasonings', 'Preservatives'],
      nutritionFacts: {
        servingSize: '2 oz (56g)',
        calories: '95',
        protein: '16g',
        sodium: '720mg'
      },
      features: [
        'Authentic Manipuri preparation',
        'Ready to eat',
        'Traditional roasting method',
        'Rich in protein',
        'No artificial flavors'
      ]
    },
    'chicken-pickle': {
      name: 'Chicken Pickle',
      price: '$15.99',
      image: '/lovable-uploads/5d3d1fda-566d-4288-867d-21ed4494e26f.png',
      description: 'A product of Manipur - Just like homemade chicken pickle with traditional spices and authentic flavors. Made using time-honored family recipes.',
      ingredients: ['Free-range chicken', 'Traditional spices', 'Mustard oil', 'Salt', 'Natural preservatives'],
      nutritionFacts: {
        servingSize: '3 oz (85g)',
        calories: '145',
        protein: '18g',
        sodium: '620mg'
      },
      features: [
        'Homemade taste',
        'Traditional Manipuri recipe',
        'Made with free-range chicken',
        'Authentic spice blend',
        'Long shelf life'
      ]
    },
    'spicy-lentil-crisp': {
      name: 'Spicy Lentil Crisp',
      price: '$12.99',
      image: '/lovable-uploads/8dae3250-8a46-444e-8b50-f50cf472cff8.png',
      description: 'Bori Mix - Crunchy spicy lentil crisps perfect as a snack or side dish with traditional meals. Made from premium lentils with authentic spices.',
      ingredients: ['Black gram lentils', 'Spice mix', 'Salt', 'Oil', 'Natural seasonings'],
      nutritionFacts: {
        servingSize: '1 oz (28g)',
        calories: '110',
        protein: '8g',
        sodium: '380mg'
      },
      features: [
        'Crunchy texture',
        'High protein content',
        'Traditional preparation',
        'Perfect snack food',
        'Vegetarian friendly'
      ]
    },
    'spicy-soybean-crisp': {
      name: 'Spicy Soybean Crisp',
      price: '$14.99',
      image: '/lovable-uploads/96a97ecf-07a2-4ca9-90c6-5bef5e37e2c2.png',
      description: 'Hawaijar Mix - Crispy spicy soybean mix with authentic traditional flavors and spices. A popular side dish from Manipur.',
      ingredients: ['Fermented soybeans', 'Chili powder', 'Salt', 'Traditional spices', 'Oil'],
      nutritionFacts: {
        servingSize: '1 oz (28g)',
        calories: '120',
        protein: '10g',
        sodium: '420mg'
      },
      features: [
        'Fermented soybean base',
        'Spicy and flavorful',
        'Traditional Hawaijar preparation',
        'Rich in protein',
        'Authentic taste'
      ]
    },
    'dry-chilli-chutney': {
      name: 'Dry Chilli Chutney',
      price: '$11.99',
      image: '/lovable-uploads/96367fda-747a-4537-947c-446c43ab2308.png',
      description: 'Ametpa Mix with Ngari - Traditional dry chilli chutney with fermented fish, packed with authentic flavors and traditional preparation methods.',
      ingredients: ['Dry chilies', 'Fermented fish', 'Salt', 'Traditional spices', 'Oil'],
      nutritionFacts: {
        servingSize: '1 tbsp (15g)',
        calories: '45',
        protein: '3g',
        sodium: '280mg'
      },
      features: [
        'Authentic chutney preparation',
        'Traditional Ngari blend',
        'Intense flavor profile',
        'Long-lasting taste',
        'Versatile condiment'
      ]
    },
    'spicy-stink-beans': {
      name: 'Spicy Stink Beans',
      price: '$13.99',
      image: '/lovable-uploads/80957d89-ebbe-4a50-93ee-d05b8b7f70b5.png',
      description: 'Yongchak Maru Mix - Traditional spicy stink beans preparation with authentic Manipuri spices. A unique delicacy with distinctive flavors.',
      ingredients: ['Tree beans (Yongchak)', 'Spice blend', 'Salt', 'Oil', 'Traditional seasonings'],
      nutritionFacts: {
        servingSize: '2 oz (56g)',
        calories: '85',
        protein: '7g',
        sodium: '350mg'
      },
      features: [
        'Unique tree bean preparation',
        'Traditional Manipuri delicacy',
        'Distinctive flavor',
        'Nutritious and healthy',
        'Authentic spice blend'
      ]
    },
    'bamboo-shoot-chicken-pickle': {
      name: 'Bamboo Shoot Chicken Pickle',
      price: '$16.99',
      image: '/lovable-uploads/02bd53a8-2cb2-4f88-8765-a8ac21aa2273.png',
      description: 'Premium bamboo shoot chicken pickle combining tender chicken with fresh bamboo shoots in traditional spices. A gourmet preparation from Manipur.',
      ingredients: ['Chicken', 'Fresh bamboo shoots', 'Traditional spices', 'Oil', 'Natural preservatives'],
      nutritionFacts: {
        servingSize: '3 oz (85g)',
        calories: '155',
        protein: '20g',
        sodium: '580mg'
      },
      features: [
        'Fresh bamboo shoots',
        'Premium chicken cuts',
        'Gourmet preparation',
        'Traditional recipe',
        'Rich in nutrients'
      ]
    }
  };

  const product = products[id as keyof typeof products];

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Product Not Found</h1>
            <Link to="/shop" className="text-gray-600 hover:text-black">
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
            <Link to="/shop" className="text-gray-600 hover:text-black">Shop</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-lg border border-gray-200"
              />
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-black mb-6">
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
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black"
                />
                <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Product Features */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-black mb-4">Product Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-black mr-2">✓</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-black mb-4">Ingredients</h3>
                <p className="text-gray-600">
                  {product.ingredients.join(', ')}
                </p>
              </div>

              {/* Nutrition Facts */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold text-black mb-4">Nutrition Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-black">Serving Size:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.servingSize}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Calories:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.calories}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Protein:</span>
                    <span className="text-gray-600 ml-2">{product.nutritionFacts.protein}</span>
                  </div>
                  <div>
                    <span className="font-medium text-black">Sodium:</span>
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

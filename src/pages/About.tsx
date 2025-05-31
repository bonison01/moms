
import Layout from '../components/Layout';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            A passion for authentic flavors and traditional recipes that brings families together
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">The Beginning of Momsgoogoo Foods</h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Momsgoogoo Foods was born from a simple belief: that the best food comes from the heart, 
              made with love, and shared with those we care about. Our journey began in a small kitchen 
              where traditional recipes were passed down through generations, each dish telling a story 
              of heritage and craftsmanship.
            </p>

            <p className="text-lg text-gray-600 mb-8">
              What started as family recipes shared among friends has grown into a passionate endeavor 
              to bring authentic, high-quality food products to tables everywhere. Our signature beef 
              pickles and Chicken Sinju represent the perfect blend of traditional methods and premium 
              ingredients.
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            
            <p className="text-lg text-gray-600 mb-6">
              At Momsgoogoo Foods, we are committed to preserving the authentic taste of traditional 
              recipes while ensuring the highest quality standards. Every product we create is a 
              testament to our dedication to excellence and our respect for culinary heritage.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-orange-800 mb-3">Quality First</h3>
                <p className="text-gray-700">
                  We source only the finest ingredients and follow traditional preparation methods 
                  to ensure every product meets our exacting standards.
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-red-800 mb-3">Authentic Flavors</h3>
                <p className="text-gray-700">
                  Our recipes honor traditional techniques while delivering the rich, complex 
                  flavors that make our products truly special.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">What Makes Us Special</h2>
            
            <ul className="list-disc list-inside text-lg text-gray-600 space-y-3 mb-8">
              <li>Small-batch production ensures consistent quality and freshness</li>
              <li>Traditional recipes refined over generations</li>
              <li>Premium ingredients sourced from trusted suppliers</li>
              <li>Careful attention to every step of the preparation process</li>
              <li>Commitment to preserving authentic flavors and techniques</li>
            </ul>

            <p className="text-lg text-gray-600 mb-6">
              When you choose Momsgoogoo Foods, you're not just buying a product – you're becoming 
              part of a tradition that values quality, authenticity, and the joy of sharing great 
              food with the people you love.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-xl text-gray-800 font-medium mb-4">
                "Food is our common ground, a universal experience."
              </p>
              <p className="text-lg text-gray-600">
                Thank you for being part of the Momsgoogoo Foods family.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

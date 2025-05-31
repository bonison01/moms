
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-orange-500">Momsgoogoo</span>
              <span className="text-2xl font-bold text-white ml-1">Foods</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Bringing authentic flavors and traditional recipes to your table. 
              Quality food products made with love and passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors">About Us</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-orange-500 transition-colors">Shop</Link></li>
              <li><Link to="/reviews" className="text-gray-300 hover:text-orange-500 transition-colors">Reviews</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Momsgoogoo Foods. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

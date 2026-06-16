import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-xl text-slate-900">
                <Store size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Ayyappa Cloth Center</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for premium fashion and clothing. Experience shopping like never before.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Shop Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/products?category=women" className="text-slate-400 hover:text-white transition-colors text-sm">Women's Fashion</Link></li>
              <li><Link to="/products?category=men" className="text-slate-400 hover:text-white transition-colors text-sm">Men's Fashion</Link></li>
              <li><Link to="/products?category=kids" className="text-slate-400 hover:text-white transition-colors text-sm">Kids' Collection</Link></li>
              <li><Link to="/products?category=activewear" className="text-slate-400 hover:text-white transition-colors text-sm">Activewear</Link></li>
              <li><Link to="/products?category=formal" className="text-slate-400 hover:text-white transition-colors text-sm">Formal Wear</Link></li>
              <li><Link to="/products?category=seasonal" className="text-slate-400 hover:text-white transition-colors text-sm">Seasonal Collections</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Track Order</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Return Policy</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">Shipping Info</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Newsletter</h3>
            <p className="text-slate-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-slate-800 border bg-transparent border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-slate-500 text-sm"
              />
              <button 
                type="button" 
                className="bg-white text-slate-900 px-4 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Ayyappa Cloth Center. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

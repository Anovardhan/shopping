import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User as UserIcon, Search, Menu, X, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/data';

const Navbar = () => {
  const { cartCount, clearCart } = useCart();
  const { wishlist, clearWishlist } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCart();
    clearWishlist();
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-xl text-white">
              <Store size={24} />
            </div>
            <span className="font-bold text-[14px] sm:text-2xl tracking-tight text-slate-900 whitespace-nowrap">Ayyappa Cloth Center</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-2xl px-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input 
                type="text" 
                placeholder="Search for products, brands and more..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none text-sm placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            </form>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/wishlist" className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors relative group">
              <Heart size={24} className="group-hover:fill-red-50 text-slate-700" />
              <span className="text-[10px] font-medium">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors relative group">
              <ShoppingCart size={24} className="text-slate-700" />
              <span className="text-[10px] font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors">
                  <UserIcon size={24} className="text-slate-700" />
                  <span className="text-[10px] font-medium line-clamp-1 max-w-[60px]">{user?.username}</span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                  <div className="p-2 space-y-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">Orders</Link>
                    {user?.isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg">Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex items-center justify-center px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-slate-700">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Desktop Bar */}
      <div className="hidden md:block border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3 no-scrollbar">
            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap">All Products</Link>
            {categories.map((cat) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${cat.id}`} 
                className="text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 absolute w-full max-h-[calc(100vh-80px)] overflow-y-auto shadow-xl">
          <div className="p-4 space-y-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            </form>

            <div className="grid grid-cols-2 gap-4">
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                <Heart size={20} className="text-slate-700" />
                <span className="font-medium text-slate-700">Wishlist</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <UserIcon size={20} className="text-slate-700" />
                    <span className="font-medium text-slate-700">Profile</span>
                  </Link>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="col-span-1 flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <ShoppingCart size={20} className="text-slate-700" />
                    <span className="font-medium text-slate-700">Orders</span>
                  </Link>
                  {user?.isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="col-span-1 flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100">
                      <Store size={20} className="text-blue-600" />
                      <span className="font-bold text-blue-600">Admin Panel</span>
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="col-span-1 flex items-center gap-3 p-3 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 text-left">
                    <UserIcon size={20} className="text-red-500 text-left" />
                    <span className="font-medium text-red-600">Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <UserIcon size={20} className="text-slate-700" />
                  <span className="font-medium text-slate-700">Login</span>
                </Link>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Categories</h3>
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/products?category=${cat.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

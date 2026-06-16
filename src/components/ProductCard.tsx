import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isWished = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-slate-100">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <Link to={`/products/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button 
          onClick={toggleWishlist}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-600 hover:text-red-500 transition-colors shadow-sm"
        >
          <Heart size={18} className={isWished ? 'fill-red-500 text-red-500' : ''} />
        </button>
        {product.discount_price < product.price && (
          <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            -{Math.round((1 - product.discount_price / product.price) * 100)}%
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-slate-700">{product.rating.toFixed(1)}</span>
        </div>
        
        <Link to={`/products/${product.id}`} className="block flex-grow">
          <h3 className="text-slate-800 font-medium line-clamp-2 hover:text-blue-600 transition-colors mb-1">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 mb-3">{product.brand}</p>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">₹{product.discount_price}</span>
            {product.discount_price < product.price && (
              <span className="text-sm text-slate-400 line-through">₹{product.price}</span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center p-3 sm:px-4 sm:py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl transition-colors gap-2"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline text-sm font-medium">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

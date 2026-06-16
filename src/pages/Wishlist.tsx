import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center"
      >
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <Heart size={48} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Save your favorite items here to review and purchase them later.</p>
        <Link 
          to="/products"
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          Explore Products
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-[70vh]"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Wishlist</h1>
          <p className="text-slate-500 mt-2">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
        </div>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        {wishlist.map((product) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            key={product.id}
            className="relative"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Wishlist;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';

import { motion } from 'motion/react';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products, addReview, deleteReview } = useProducts();
  const { user, isAuthenticated } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const product = products.find(p => p.id === id);
  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Not Found</h2>
        <button 
          onClick={() => navigate('/products')}
          className="text-blue-600 font-medium hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Products
        </button>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const discountPercentage = Math.round((1 - product.discount_price / product.price) * 100);

  const handleQuantityChange = (type: 'inc' | 'dec') => {
    if (type === 'inc' && quantity < product.stock) {
      setQuantity(q => q + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to your cart.');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const toggleWishlist = () => {
    if (isWished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    addReview(product.id, {
      userId: user?.id || 'guest',
      userName: user?.username || 'Guest User',
      rating,
      comment
    });
    
    setRating(0);
    setComment('');
  };

  const reviews = product.reviews || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Product Image */}
        <div className="relative aspect-square md:aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover object-center"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-6 left-6 bg-red-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg shadow-red-500/30">
              -{discountPercentage}% OFF
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm font-bold tracking-wider text-slate-500 uppercase">
            {product.brand}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-700">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-slate-500 font-medium">{reviews.length > 0 ? reviews.length : 124} Reviews</span>
            <span className="text-slate-300">•</span>
            {product.stock > 0 ? (
              <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 border border-emerald-100 rounded-lg">In Stock</span>
            ) : (
              <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 border border-red-100 rounded-lg">Out of Stock</span>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-slate-900">₹{product.discount_price}</span>
              {product.discount_price < product.price && (
                <span className="text-xl text-slate-400 line-through mb-1">₹{product.price}</span>
              )}
            </div>
            <p className="text-sm text-slate-500">Inclusive of all taxes</p>
          </div>

          <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="font-semibold text-slate-900">Quantity</div>
            <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => handleQuantityChange('dec')}
                className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus size={18} />
              </button>
              <div className="w-12 text-center font-bold text-slate-900">{quantity}</div>
              <button 
                onClick={() => handleQuantityChange('inc')}
                className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                <Plus size={18} />
              </button>
            </div>
            <span className="text-xs text-slate-400">{product.stock} items available</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:shadow-none"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button 
              onClick={toggleWishlist}
              className={`flex items-center justify-center p-4 border rounded-2xl transition-colors ${isWished ? 'border-red-200 bg-red-50 text-red-500' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
              <Heart size={24} className={isWished ? 'fill-red-500' : ''} />
            </button>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 text-slate-600">
              <div className="bg-slate-100 p-3 rounded-full"><Truck size={20} /></div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Free Delivery Setup</p>
                <p className="text-xs">Enter your postal code for delivery availability</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-600">
              <div className="bg-slate-100 p-3 rounded-full"><ShieldCheck size={20} /></div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Return Delivery</p>
                <p className="text-xs">Free 30 days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Customer Reviews
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Write a review */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-6 h-6 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                    rows={4}
                    placeholder="What did you think about this product?"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={rating === 0}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>

          {/* List of reviews */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No reviews yet</h3>
                <p className="text-slate-500">Be the first to review this product!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{review.userName}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                      {isAuthenticated && user?.id === review.userId && (
                        <button
                          onClick={() => deleteReview(product.id, review.id)}
                          className="text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map(p => (
              <div key={p.id} className="relative group rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
                 <div className="aspect-[4/5] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${p.id}`)}>
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                 </div>
                 <div className="p-4 bg-white">
                    <p className="text-xs text-slate-500 mb-1">{p.brand}</p>
                    <h3 className="font-medium text-slate-900 truncate mb-2">{p.title}</h3>
                    <div className="font-bold text-slate-900">₹{p.discount_price}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetails;

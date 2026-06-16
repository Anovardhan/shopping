import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="min-h-[60vh] flex flex-col items-center justify-center p-4"
      >
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <ShoppingBag size={48} className="text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link 
          to="/products"
          className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white"
    >
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-full sm:w-32 h-32 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/products/${item.product.id}`)}>
                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">{item.product.brand}</p>
                      <h3 className="font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600" onClick={() => navigate(`/products/${item.product.id}`)}>
                        {item.product.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-900">Qty:</span>
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="w-10 text-center text-sm font-medium">{item.quantity}</div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-900">₹{(item.product.discount_price * item.quantity).toFixed(2)}</div>
                      {item.product.discount_price < item.product.price && (
                        <div className="text-xs text-slate-400 line-through">₹{(item.product.price * item.quantity).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-slate-50 rounded-3xl p-8 sticky top-28 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping estimate</span>
                <span className="font-medium text-slate-900">₹5.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax estimate</span>
                <span className="font-medium text-slate-900">₹{(cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-bold text-slate-900">Order Total</span>
                <span className="text-2xl font-bold text-slate-900">₹{(cartTotal + 5 + cartTotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              Checkout <ArrowRight size={18} />
            </button>

            <div className="mt-6 text-center">
              <Link to="/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;

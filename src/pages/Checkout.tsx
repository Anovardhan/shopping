import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CreditCard, Truck, ShieldCheck, MapPin } from "lucide-react";
import api from "../utils/api";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalAmount = cartTotal + 5 + cartTotal * 0.08;

  const [formData, setFormData] = useState({
    fullname: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);

    try {
      if (!user) {
        setIsProcessing(false);
        alert("Please log in to place an order.");
        return;
      }

      const newOrder = {
        user_id: user.id || "",
        total_amount: totalAmount,
        order_status: "PROCESSING",
        created_at: new Date().toISOString(),
        items: cart.map((item) => ({
          id: item.product.id,
          product: item.product,
          quantity: item.quantity,
          price: item.product.discount_price,
        })),
        customer_details: formData,
      };

      // Save order to Firestore
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('../utils/firebase');
      await addDoc(collection(db, "orders"), newOrder);

      // Local fallback sync
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem(
        "orders",
        JSON.stringify([...savedOrders, newOrder]),
      );

      clearCart();
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);
      setIsProcessing(false);
      alert("There was an error processing your order. Please try again.");
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) {
      navigate("/cart");
    }
  }, [cart.length, navigate, isSuccess]);

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-emerald-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={48} className="text-emerald-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Order is successful!
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Please contact to <strong>9948237058</strong> number for order.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex py-3 px-8 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          View My Orders
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Checkout Form */}
        <div className="flex-1 space-y-8">
          <form onSubmit={handlePlaceOrder} id="checkout-form">
            {/* Shipping Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Shipping Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    required
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    required
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">Payment</h2>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                <p className="text-slate-600 mb-4 font-medium">
                  Cash on Delivery (COD)
                </p>
                <p className="text-sm text-slate-500">
                  Pay with cash upon delivery. No upfront payment required.
                </p>
              </div>

              <button
                disabled={isProcessing}
                type="submit"
                form="checkout-form"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50"
              >
                {isProcessing ? "Processing Order..." : "Contact for Order"}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 sticky top-28">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      ₹
                      {(item.product.discount_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-medium text-slate-900">₹5.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-medium text-slate-900">
                  ₹{(cartTotal * 0.08).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span>Secure Checkout 256-bit encryption</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Truck size={18} className="text-blue-500" />
                <span>Fast & insured shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

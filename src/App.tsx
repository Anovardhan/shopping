/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProductProvider } from './context/ProductContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminOrders from './pages/Admin';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div></div>;
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !user?.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminOrders />
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                  <AnimatedRoutes />
                </main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

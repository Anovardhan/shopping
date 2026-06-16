import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { database } from '../utils/firebase';
import { ref, get } from 'firebase/database';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch orders from Firebase
    const fetchOrders = async () => {
      try {
        const ordersRef = ref(database, 'orders');
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
          const fetched = Object.values(snapshot.val());
          const userOrders = fetched.filter((o: any) => o.user_id === user.id);
          setOrders(userOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        // Fallback to local storage if API is offline
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders).filter((o: any) => o.user_id === user.id));
        }
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PROCESSING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle size={16} />;
      case 'SHIPPED': return <Truck size={16} />;
      case 'PROCESSING': return <Clock size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-[70vh]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
          <p className="text-slate-500 mt-2">View and track your previous orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="bg-white p-6 rounded-full mb-6 border border-slate-100 shadow-sm">
            <Package size={48} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h2>
          <p className="text-slate-500 mb-8 max-w-sm text-center">When you place an order, it will appear here.</p>
          <Link 
            to="/products"
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(order => (
            <div key={order.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-12">
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">ORDER NUMBER</p>
                    <p className="text-sm font-bold text-slate-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">DATE PLACED</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">TOTAL AMOUNT</p>
                    <p className="text-sm font-bold text-slate-900">₹{order.total_amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${getStatusColor(order.order_status)}`}>
                  {getStatusIcon(order.order_status)}
                  {order.order_status}
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link to={`/products/${item.product.id}`} className="font-bold text-slate-900 line-clamp-1 hover:text-blue-600 mb-1">
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-slate-500 mb-2">{item.product.brand}</p>
                        <div className="text-sm font-medium text-slate-700">
                          ₹{item.price} <span className="text-slate-400 mx-2">x</span> {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

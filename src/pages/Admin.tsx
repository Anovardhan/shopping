import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { OrderType } from "../types";
import {
  Package,
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { categories } from "../data/data";
import api from "../utils/api";

const AdminOrders = () => {
  const { user } = useAuth();
  const { products, addProduct, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: "",
    category: "women",
    price: "",
    discount_price: "",
    description: "",
    image: "",
    brand: "",
    stock: "",
    tax: "",
  });

  useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchOrders = () => {
    api.get<OrderType[]>("/orders")
      .then((res) => {
        const fetched = res.data || [];
        fetched.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setOrders(fetched);
      })
      .catch((err) => {
        console.error("Error fetching admin orders:", err);
        // Localstorage fallback
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        savedOrders.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        setOrders(savedOrders);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB. Please choose a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      title: productForm.title,
      category: productForm.category,
      price: Number(productForm.price),
      discount_price: Number(productForm.discount_price),
      description: productForm.description,
      image: productForm.image,
      brand: productForm.brand,
      stock: Number(productForm.stock),
      tax: productForm.tax ? Number(productForm.tax) : undefined,
    });
    setProductForm({
      title: "",
      category: "women",
      price: "",
      discount_price: "",
      description: "",
      image: "",
      brand: "",
      stock: "",
      tax: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    alert("Product added successfully!");
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await api.delete(`/orders/${orderId}`);
      const updatedOrders = orders.filter((o) => o.id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    } catch (err) {
      console.error("Error deleting order:", err);
      // Fallback
    }
  };

  if (!user?.isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Package className="text-slate-900" size={32} />
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "orders"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Manage Products
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
              <Package className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                No orders yet
              </h2>
              <p className="text-slate-500">
                When customers place orders, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">
                        {order.id}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <Clock size={14} />
                        <span>
                          {new Date(order.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700">
                        {order.order_status}
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        ₹{order.total_amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete order"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Details */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        Customer Details
                      </h4>
                      {order.customer_details ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <UserIcon
                              className="text-slate-400 mt-0.5"
                              size={18}
                            />
                            <div>
                              <p className="font-medium text-slate-900">
                                {order.customer_details.fullname}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail className="text-slate-400 mt-0.5" size={18} />
                            <div>
                              <p className="text-slate-600">
                                {order.customer_details.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Phone
                              className="text-slate-400 mt-0.5"
                              size={18}
                            />
                            <div>
                              <p className="text-slate-600">
                                {order.customer_details.phone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin
                              className="text-slate-400 mt-0.5"
                              size={18}
                            />
                            <div>
                              <p className="text-slate-600 leading-tight">
                                {order.customer_details.address}
                                <br />
                                {order.customer_details.city},{" "}
                                {order.customer_details.state}{" "}
                                {order.customer_details.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">
                          No customer details provided (legacy order).
                        </p>
                      )}
                    </div>

                    {/* Ordered Items */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                        Ordered Items ({order.items.length})
                      </h4>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 truncate">
                                {item.product.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="font-bold text-slate-900">
                              ₹{(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "products" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus size={24} className="text-blue-600" /> Add New Product
            </h2>
            <form
              onSubmit={handleProductSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  required
                  type="text"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Brand
                </label>
                <input
                  required
                  type="text"
                  value={productForm.brand}
                  onChange={(e) =>
                    setProductForm({ ...productForm, brand: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Original Price (₹)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm({ ...productForm, price: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Discount Price (₹)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={productForm.discount_price}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      discount_price: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm({ ...productForm, stock: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={productForm.tax}
                  onChange={(e) =>
                    setProductForm({ ...productForm, tax: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <input
                    ref={fileInputRef}
                    required={!productForm.image}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  {productForm.image && (
                    <img
                      src={productForm.image}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                ></textarea>
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Current Products ({products.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {product.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      ₹{product.discount_price} • {product.category}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete product"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-slate-500 col-span-3 text-center py-10">
                  No products added yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

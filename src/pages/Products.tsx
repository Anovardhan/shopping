import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/data';
import { useProducts } from '../context/ProductContext';

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [priceRange, setPriceRange] = useState(1000); // max price
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    // Apply filters
    let result = products;

    if (searchParam) {
      const lowerQuery = searchParam.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.discount_price <= priceRange);
    result = result.filter(p => p.rating >= minRating);

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.discount_price - b.discount_price);
        break;
      case 'price-high':
        result.sort((a, b) => b.discount_price - a.discount_price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        // Mock sorting by ID for newest
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, priceRange, minRating, sortBy, searchParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {searchParam ? `Search Results for "${searchParam}"` : 
             categoryParam ? categories.find(c => c.id === categoryParam)?.name :
             'All Products'}
          </h1>
          <p className="text-slate-500 mt-1">Showing {filteredProducts.length} products</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl font-medium text-slate-700 bg-white"
          >
            <Filter size={18} />
            Filters
          </button>

          <div className="relative flex-1 md:w-48">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 border border-slate-200 rounded-xl font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`md:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} md:block`}>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold">
              <SlidersHorizontal size={20} />
              <h2 className="text-lg">Filters</h2>
            </div>
            
            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3">Category</h3>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === 'all'} 
                    onChange={() => handleCategoryChange('all')}
                    className="w-4 h-4 accent-slate-900 bg-slate-100 border-slate-300 focus:ring-slate-900"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900 transition-colors">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat.id} 
                      onChange={() => handleCategoryChange(cat.id)}
                      className="w-4 h-4 accent-slate-900 bg-slate-100 border-slate-300"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-slate-900 mb-3 flex justify-between">
                <span>Price Range</span>
                <span className="text-sm font-normal text-blue-600">Up to ₹{priceRange}</span>
              </h3>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="10"
                value={priceRange} 
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2">
                <span>₹0</span>
                <span>₹1000+</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2 text-sm">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === rating} 
                      onChange={() => setMinRating(rating)}
                      className="w-4 h-4 accent-slate-900"
                    />
                    <span className="text-slate-600 group-hover:text-slate-900 flex items-center">
                      {rating} Stars & Up
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={minRating === 0} 
                    onChange={() => setMinRating(0)}
                    className="w-4 h-4 accent-slate-900"
                  />
                  <span className="text-slate-600 group-hover:text-slate-900">Any Rating</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
            >
              {filteredProducts.map(product => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Filter size={48} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-500 max-w-md">Try adjusting your filters or search query to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange(1000);
                  setMinRating(0);
                  setSearchParams({});
                }}
                className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Products;

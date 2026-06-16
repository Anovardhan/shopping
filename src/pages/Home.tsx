import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/data';
import { useProducts } from '../context/ProductContext';

const Home = () => {
  const { products } = useProducts();
  const trendingProducts = products.filter(p => p.rating > 4.5).slice(0, 8);
  const newArrivals = products.slice(0, 8);

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const heroSlides = [
    {
      type: 'poster',
      id: 'ayyappa-banner',
      image: '/banner.jpeg'
    },
    {
      type: 'image',
      id: 'fashion',
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80",
      title: "Discover Your Perfect Style",
      subtitle: "Explore our curated collection of premium fashion, accessories, and modern clothing essentials.",
      buttonText: "Shop Now",
      buttonLink: "/products"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      {/* Hero Banner Carousel */}
      <div className="relative overflow-hidden h-[250px] sm:h-[400px] lg:h-[600px] bg-slate-900">
        <div className="relative w-full h-full flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
           {heroSlides.map((slide, index) => (
             <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
               {slide.type === 'poster' ? (
                 <div className="w-full h-full bg-[#fcf80d] flex items-center justify-center relative overflow-hidden">
                    <img
                      src={slide.image}
                      alt="Banner"
                      className="w-full h-full object-contain object-center"
                    />
                 </div>
               ) : slide.type === 'image' ? (
                <>
                  <div className="absolute inset-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                  </div>
                  <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24 lg:py-32 flex items-center">
                    <div className="max-w-2xl">
                      <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-4 sm:mb-6">
                        {slide.title?.split(' ').slice(0, 2).join(' ')} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{slide.title?.split(' ').slice(2).join(' ')}</span>
                      </h1>
                      <p className="text-sm sm:text-xl text-slate-300 mb-6 sm:mb-10 max-w-lg leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Link 
                          to={slide.buttonLink || '/products'}
                          className="inline-flex justify-center items-center px-6 py-2 sm:px-8 sm:py-4 bg-white text-slate-900 rounded-full font-bold text-sm sm:text-lg hover:bg-slate-100 transition-colors"
                        >
                          {slide.buttonText}
                        </Link>
                        <Link 
                          to="/products?category=seasonal"
                          className="inline-flex justify-center items-center px-6 py-2 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-bold text-sm sm:text-lg hover:bg-white/20 transition-colors"
                        >
                          View Seasonal
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-[#ffea00] flex flex-col items-center justify-center text-center p-4 sm:p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600"></div>
                  <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-[#7a0099] flex items-center justify-center">
                    <p className="text-white font-bold tracking-widest text-2xl sm:text-4xl md:text-5xl">సెల్: 9948237058</p>
                  </div>
                  
                  <div className="z-10 flex flex-col items-center max-w-4xl mx-auto pb-16 sm:pb-24">
                     <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 sm:mb-8 tracking-tight" style={{ color: '#cc0000', textShadow: '4px 4px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white' }}>
                        అయ్యప్ప క్లాత్ సెంటర్
                     </h1>
                     <div className="bg-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl border border-purple-200 shadow-xl max-w-3xl transform -rotate-1">
                        <p className="text-[#4a0080] font-bold text-lg sm:text-2xl md:text-3xl leading-snug">
                          పోచమ్మ టెంపుల్ పక్కన మున్సిపల్ షాపింగ్ కాంప్లెక్స్ లోని (36B) కి
                          <br />
                          <span className="text-[#ff0000] text-3xl sm:text-4xl md:text-5xl block mt-2 transform scale-110">మార్చబడినది</span>
                        </p>
                     </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-slate-200 p-3 rounded-full text-slate-700">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Free Shipping</h4>
                <p className="text-slate-500 text-xs">On orders over ₹50</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-200 p-3 rounded-full text-slate-700">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Secure Payment</h4>
                <p className="text-slate-500 text-xs">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-200 p-3 rounded-full text-slate-700">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Easy Returns</h4>
                <p className="text-slate-500 text-xs">30 day return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-200 p-3 rounded-full text-slate-700">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">24/7 Support</h4>
                <p className="text-slate-500 text-xs">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-on-scroll">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Shop by Category</h2>
            <p className="text-slate-500">Find exactly what you are looking for</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/products?category=${category.id}`}
              className="group relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-slate-100"
            >
              <img 
                src={category.image} 
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-xl mb-1 group-hover:-translate-y-1 transition-transform">{category.name}</h3>
                <span className="text-white/80 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Trending Now</h2>
              <p className="text-slate-500">Top rated products loved by our customers</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center text-slate-900 font-medium hover:text-blue-600 transition-colors">
              View All <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
          >
            {trendingProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-10 sm:hidden">
            <Link to="/products" className="w-full flex items-center justify-center py-4 bg-slate-200 text-slate-900 font-medium rounded-xl hover:bg-slate-300 transition-colors">
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">New Arrivals</h2>
            <p className="text-slate-500">Check out the latest additions to our store</p>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8"
        >
          {newArrivals.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;

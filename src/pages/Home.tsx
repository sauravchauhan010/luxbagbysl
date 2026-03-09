import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { ShieldCheck, RefreshCw, Award, ArrowRight, ShoppingBag } from 'lucide-react';

const Home = () => {
  const { products } = useAppContext();
  const featuredProducts = products.filter(p => p.is_curated === 1).slice(0, 4);
  
  // Fallback if no curated products
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden perspective-1000">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=2000"
            alt="Luxury Bag Hero"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="relative z-10 text-center text-white px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, rotateX: -45, y: 50 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="preserve-3d"
          >
            <p className="uppercase tracking-widest text-sm font-bold mb-4 text-gold">
              Exquisite Collection
            </p>
            <h1 className="text-6xl md:text-9xl font-display tracking-tighter leading-none mb-8 font-bold">
              Elevate <br className="md:hidden" /> Your Style
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <Link to="/shop" className="btn-gold px-12 py-4 text-sm font-bold hover:scale-105 transition-transform">
                Explore Collection
              </Link>
              <Link to="/about" className="px-12 py-4 text-sm border border-white/30 backdrop-blur-sm hover:bg-white hover:text-luxury-black transition-all font-bold">
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements for 3D depth */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-32 h-32 border border-gold/20 rounded-full hidden lg:block"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-48 h-48 border border-white/10 rounded-full hidden lg:block"
        />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 text-center md:text-left gap-6"
        >
          <div>
            <p className="text-gold uppercase tracking-widest text-xs mb-2">Curated Selection</p>
            <h2 className="text-5xl font-display">Featured Pieces</h2>
          </div>
          <Link to="/shop" className="group flex items-center space-x-2 text-sm uppercase tracking-widest border-b border-luxury-black pb-1 hover:text-gold hover:border-gold transition-all">
            <span>View All Collection</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ 
                y: -15,
                rotateY: 5,
                rotateX: -5,
                transition: { duration: 0.3 }
              }}
              className="group perspective-1000"
            >
              <Link to={`/product/${product.id}`} className="block preserve-3d">
                <div className="aspect-[4/5] overflow-hidden bg-white mb-6 relative luxury-shadow border border-gray-100 group-hover:border-gold/30 transition-colors">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400x500'}
                    alt={product.product_name}
                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 p-6"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
                    <span className="bg-luxury-black text-white px-3 py-1 text-[9px] uppercase tracking-widest font-bold">
                      {product.condition}
                    </span>
                    <span className="bg-gold text-luxury-black px-3 py-1 text-[9px] uppercase tracking-widest font-bold">
                      {product.category}
                    </span>
                  </div>
                  {/* Overlay effect */}
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/5 transition-colors duration-500" />
                </div>
                <div className="space-y-2 transform group-hover:translate-z-10">
                  <h3 className="text-sm uppercase tracking-widest font-bold group-hover:text-gold transition-colors">{product.product_name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AED</span>
                    <p className="text-luxury-black font-display text-2xl font-bold tracking-tight">
                      {product.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Buy Sell Consign Section */}
      <section className="bg-luxury-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-display">Buy</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Discover our curated collection of 100% authentic luxury bags from world-renowned brands.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-display">Sell</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Turn your luxury items into cash. We offer competitive prices for your preloved designer bags.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-gold" size={24} />
              </div>
              <h3 className="text-2xl font-display">Consign</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Let us handle the selling for you. Reach a wide audience of luxury enthusiasts through our platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authenticity Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gold-light p-12 md:p-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-display">Authenticity Guaranteed</h2>
            <p className="text-gray-600 font-light leading-relaxed">
              At Lux Bag by S and L, we take authenticity seriously. Every item in our collection undergoes a rigorous multi-point inspection process. We stand behind our products with a 100% money-back guarantee.
            </p>
            <div className="flex items-center space-x-4 text-gold">
              <ShieldCheck size={32} />
              <span className="uppercase tracking-widest text-xs font-semibold">Verified Authentic</span>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&q=80&w=1000"
              alt="Authenticity Check"
              className="w-full h-auto shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="text-center py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <h2 className="text-4xl font-display">Have a Question?</h2>
          <p className="text-gray-500 font-light">
            Our luxury consultants are available to assist you with any inquiries regarding our collection, selling, or consignment.
          </p>
          <a
            href="https://wa.me/971505876447"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center space-x-3"
          >
            <span>Inquire via WhatsApp</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';
import { ShieldCheck, ArrowRight, ShoppingBag, Star, Truck, Lock } from 'lucide-react';

const Home = () => {
  const { products } = useAppContext();
  const featuredProducts = products.filter(p => p.is_curated === 1).slice(0, 4);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="space-y-24 pb-24">

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover brightness-50"
          >
            <source src="https://res.cloudinary.com/dvavzjzmp/video/upload/v1773264015/invideo-ai-1080_12s_Luxury_Loop_That_Feels_Premium_2026-03-11_v4tenk.mp4" type="video/mp4" />
            {/* Fallback image if video fails */}
            <img
              src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=2000"
              alt="Luxury Bag Hero"
              className="w-full h-full object-cover"
            />
          </video>
        </div>

        <div className="relative z-10 text-center text-white px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="uppercase tracking-widest text-sm font-bold mb-4 text-gold">Exquisite Collection</p>
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

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-32 h-32 border border-gold/20 rounded-full hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-10 w-48 h-48 border border-white/10 rounded-full hidden lg:block"
        />
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <ShieldCheck size={28} />, title: '100% Authentic', desc: 'Every piece verified and authenticated by our luxury experts' },
            { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Secure and insured delivery across the UAE and worldwide' },
            { icon: <Lock size={28} />, title: 'Secure Purchase', desc: 'Safe & encrypted transactions. Your privacy is our priority' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5 p-6 border border-gray-100 hover:border-gold/30 transition-colors group"
            >
              <div className="text-gold flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div>
                <h4 className="font-bold uppercase tracking-widest text-xs mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link to={`/product/${product.id}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-50 mb-4" style={{ aspectRatio: '4/5' }}>
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400x500'}
                    alt={product.product_name}
                    className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold ${product.condition === 'New' ? 'bg-luxury-black text-white' : 'bg-gold text-luxury-black'}`}>
                      {product.condition}
                    </span>
                    {product.is_curated === 1 && (
                      <span className="bg-white text-gold px-2.5 py-1 text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 shadow-sm">
                        <Star size={8} fill="currentColor" /> Curated
                      </span>
                    )}
                  </div>

                  {/* Hover overlay with quick action */}
                  <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 bg-luxury-black text-white py-3 text-center text-[10px] uppercase tracking-widest font-bold translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingBag size={12} /> View Details
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 px-1">
                  <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">{product.category}</p>
                  <h3 className="text-sm font-bold leading-tight group-hover:text-gold transition-colors line-clamp-2">{product.product_name}</h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AED</span>
                    <span className="font-display text-2xl font-bold tracking-tight text-luxury-black">
                      {product.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Buy From Us — single column, focused on buying */}
      <section className="bg-luxury-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 mb-16"
          >
            <p className="text-gold uppercase tracking-widest text-xs">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-display">The Lux Bag Experience</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <ShieldCheck size={28} />, title: 'Authenticated', desc: 'Every bag is rigorously inspected and verified for 100% authenticity before listing.' },
              { icon: <Star size={28} />, title: 'Curated Collection', desc: 'Hand-picked luxury pieces from the world\'s most coveted brands — Hermès, Chanel, Louis Vuitton and more.' },
              { icon: <ShoppingBag size={28} />, title: 'Exclusive Access', desc: 'Discover rare and limited-edition pieces you won\'t find anywhere else in the UAE.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 border border-gold rounded-full flex items-center justify-center mx-auto text-gold">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display">{item.title}</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
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
            <Link to="/shop" className="btn-luxury inline-flex items-center space-x-3">
              <span>Shop Now</span>
              <ArrowRight size={16} />
            </Link>
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
            Our luxury consultants are available to assist you with any inquiries about our collection.
          </p>
          <a
            href="https://wa.me/971505876447"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center space-x-3"
          >
            <span>Chat with Us on WhatsApp</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

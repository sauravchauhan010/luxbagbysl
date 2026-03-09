import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../AppContext';

const Shop = () => {
  const { products, loading } = useAppContext();
  const [activeCategory, setActiveCategory] = React.useState<'All' | 'Bags' | 'Footwear'>('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16 text-center space-y-8">
        <div>
          <h1 className="text-5xl font-display mb-4">Our Collection</h1>
          <p className="text-gray-500 font-light uppercase tracking-widest text-xs">
            Discover the finest selection of luxury pieces
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center space-x-4">
          {['All', 'Bags', 'Footwear'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-8 py-2 text-[10px] uppercase tracking-[0.3em] font-bold border transition-all duration-500 ${
                activeCategory === cat 
                  ? 'bg-luxury-black text-white border-luxury-black luxury-shadow' 
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gold hover:text-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
            whileHover={{ 
              y: -10,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            className="group perspective-1000"
          >
            <Link to={`/product/${product.id}`} className="block preserve-3d">
              <div className="aspect-[4/5] overflow-hidden bg-white mb-8 relative border border-gray-100 luxury-shadow group-hover:border-gold/30 transition-all duration-500">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400x500'}
                  alt={product.product_name}
                  className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 p-8"
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
                {/* Quick view hint */}
                <div className="absolute inset-x-0 bottom-0 bg-luxury-black/80 text-white text-[10px] uppercase tracking-[0.3em] py-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  View Details
                </div>
              </div>
              <div className="space-y-2 text-center transform group-hover:translate-z-10">
                <h3 className="text-sm uppercase tracking-widest font-bold group-hover:text-gold transition-colors">
                  {product.product_name}
                </h3>
                <div className="flex items-center justify-center space-x-2">
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

      {products.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 font-light">No products found in our collection yet.</p>
        </div>
      )}
    </div>
  );
};

export default Shop;

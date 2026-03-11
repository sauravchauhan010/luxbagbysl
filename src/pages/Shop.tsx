import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { Search, X, ChevronDown } from 'lucide-react';

const Shop = () => {
  const { products, loading } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Bags' | 'Footwear'>('All');
  const [activeCondition, setActiveCondition] = useState<'All' | 'New' | 'Preloved'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOpen, setSortOpen] = useState(false);

  const sortLabels = { default: 'Default', 'price-asc': 'Price: Low to High', 'price-desc': 'Price: High to Low' };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);

    // Condition filter
    if (activeCondition !== 'All') result = result.filter(p => p.condition === activeCondition);

    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, searchQuery, activeCategory, activeCondition, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-12 text-center space-y-4">
        <h1 className="text-5xl font-display mb-2">Our Collection</h1>
        <p className="text-gray-500 font-light uppercase tracking-widest text-xs">
          Discover the finest selection of luxury pieces
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, category..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 focus:border-gold focus:outline-none text-sm transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

        {/* Category + Condition filters */}
        <div className="flex flex-wrap gap-2">
          {/* Category */}
          <div className="flex gap-1">
            {(['All', 'Bags', 'Footwear'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all ${
                  activeCategory === cat
                    ? 'bg-luxury-black text-white border-luxury-black'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-200 hidden sm:block" />

          {/* Condition */}
          <div className="flex gap-1">
            {(['All', 'New', 'Preloved'] as const).map(cond => (
              <button
                key={cond}
                onClick={() => setActiveCondition(cond)}
                className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all ${
                  activeCondition === cond
                    ? 'bg-gold text-luxury-black border-gold'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-gold hover:text-gold'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-[10px] uppercase tracking-widest font-bold hover:border-gold hover:text-gold transition-all"
          >
            {sortLabels[sortBy]} <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-lg z-20 min-w-[180px]"
              >
                {(Object.entries(sortLabels) as [typeof sortBy, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSortBy(key); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors ${
                      sortBy === key ? 'text-gold bg-gold-light' : 'hover:text-gold hover:bg-gray-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-white mb-6 relative border border-gray-100 luxury-shadow group-hover:border-gold/30 transition-all duration-500">
                    <img
                      src={product.images[0] || 'https://via.placeholder.com/400x500'}
                      alt={product.product_name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 p-8"
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
                    <div className="absolute inset-x-0 bottom-0 bg-luxury-black/80 text-white text-[10px] uppercase tracking-[0.3em] py-4 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      View Details
                    </div>
                  </div>
                  <div className="space-y-2 text-center">
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
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-gray-400 font-light text-sm mb-2">No products found</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveCondition('All'); setSortBy('default'); }}
              className="text-[10px] uppercase tracking-widest font-bold text-gold hover:underline mt-2"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;

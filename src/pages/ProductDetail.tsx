import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = product?.size ? product.size.split(',').map(s => s.trim()).filter(s => s !== '') : [];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleWhatsApp = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size before inquiring.');
      return;
    }

    const message = `Hello, I want to inquire about this ${product.category.toLowerCase()}:
    
Product Name: ${product.product_name}
Product ID: ${product.product_id}
Price: AED ${product.price.toLocaleString()}
${selectedSize ? `Selected Size: ${selectedSize}` : ''}

Link: ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971505876447?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Image Gallery */}
        <div className="space-y-6 perspective-1000">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="aspect-[4/5] overflow-hidden bg-white border border-gray-100 luxury-shadow preserve-3d"
          >
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              src={product.images[activeImage] || 'https://via.placeholder.com/800x1000'}
              alt={product.product_name}
              className="w-full h-full object-contain p-12"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveImage(idx)}
                className={`aspect-square overflow-hidden border-2 transition-all bg-white luxury-shadow ${
                  activeImage === idx ? 'border-gold scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.product_name} ${idx + 1}`} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: 10 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-10 preserve-3d"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block text-gold uppercase tracking-widest text-[10px] font-bold bg-gold-light px-3 py-1 rounded-full"
              >
                {product.category}
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-block text-luxury-black uppercase tracking-widest text-[10px] font-bold bg-gray-100 px-3 py-1 rounded-full"
              >
                {product.condition}
              </motion.span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display leading-tight font-bold">{product.product_name}</h1>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-baseline space-x-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">AED</span>
                <p className="text-5xl text-luxury-black font-bold tracking-tight">
                  {product.price.toLocaleString()}
                </p>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Ref: {product.product_id}</span>
              </div>
            </div>

            {sizes.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-luxury-black">Select Size</span>
                  {sizes.length > 1 && <span className="text-[9px] text-gold uppercase tracking-widest font-bold">Available in {sizes.length} sizes</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[50px] h-[50px] flex items-center justify-center border text-xs font-bold transition-all duration-300 ${
                        selectedSize === size 
                          ? 'bg-luxury-black text-white border-luxury-black luxury-shadow scale-110' 
                          : 'bg-white text-luxury-black border-gray-200 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-b border-gray-100 py-10">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-6 text-luxury-black">The Details</h3>
            <p className="text-gray-800 font-normal leading-relaxed whitespace-pre-line text-lg">
              {product.description}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#D4AF37', color: '#1A1A1A' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            className="w-full bg-luxury-black text-white py-6 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center space-x-4 transition-all duration-500 luxury-shadow"
          >
            <MessageCircle size={20} />
            <span>Inquire on WhatsApp</span>
          </motion.button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-5 p-4 bg-gray-50 rounded-xl"
            >
              <div className="p-4 bg-white rounded-full text-gold luxury-shadow">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">100% Authentic</p>
                <p className="text-[10px] text-gray-400 mt-1">Full Moneyback Guarantee</p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center space-x-5 p-4 bg-gray-50 rounded-xl"
            >
              <div className="p-4 bg-white rounded-full text-gold luxury-shadow">
                <Truck size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Secure Delivery</p>
                <p className="text-[10px] text-gray-400 mt-1">Complimentary in UAE</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;

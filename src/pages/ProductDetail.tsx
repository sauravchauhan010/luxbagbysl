import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ShieldCheck, Truck, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!lightboxOpen || !product) return;
    if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % product.images.length);
    if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length);
    if (e.key === 'Escape') setLightboxOpen(false);
  }, [lightboxOpen, product]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openLightbox = (idx: number) => { setLightboxIndex(idx); setLightboxOpen(true); };
  const prevImage = () => { if (!product) return; setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length); };
  const nextImage = () => { if (!product) return; setLightboxIndex(i => (i + 1) % product.images.length); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Product not found.</p>
    </div>
  );

  const handleWhatsApp = () => {
    if (sizes.length > 0 && !selectedSize) { alert('Please select a size before inquiring.'); return; }
    const message = `Hello, I want to inquire about this ${product.category.toLowerCase()}:\n\nProduct Name: ${product.product_name}\nProduct ID: ${product.product_id}\nPrice: AED ${product.price.toLocaleString()}\n${selectedSize ? `Selected Size: ${selectedSize}` : ''}\n\nLink: ${window.location.href}`;
    window.open(`https://wa.me/971505876447?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

        {/* ── Image Gallery ── */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gray-50 border border-gray-100 luxury-shadow group cursor-zoom-in"
            style={{ aspectRatio: '1/1', maxHeight: '60vh' }}
            onClick={() => openLightbox(activeImage)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                src={product.images[activeImage] || 'https://via.placeholder.com/800x800'}
                alt={product.product_name}
                className="w-full h-full object-contain p-6 md:p-10"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={10} /> Click to zoom
            </div>

            {/* Nav arrows on main image */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setActiveImage(i => (i - 1 + product.images.length) % product.images.length); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setActiveImage(i => (i + 1) % product.images.length); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-black/50 text-white text-[9px] px-2 py-1 font-bold tracking-widest">
                {activeImage + 1} / {product.images.length}
              </div>
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden border-2 transition-all bg-white ${activeImage === idx ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`view ${idx + 1}`} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gold uppercase tracking-widest text-[10px] font-bold bg-gold-light px-3 py-1">{product.category}</span>
            <span className="text-luxury-black uppercase tracking-widest text-[10px] font-bold bg-gray-100 px-3 py-1">{product.condition}</span>
            {product.is_curated === 1 && <span className="text-white uppercase tracking-widest text-[10px] font-bold bg-luxury-black px-3 py-1">★ Curated</span>}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-display leading-tight font-bold">{product.product_name}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">AED</span>
              <p className="text-4xl md:text-5xl text-luxury-black font-bold tracking-tight">{product.price.toLocaleString()}</p>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Ref: {product.product_id}</p>
          </div>

          {sizes.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-bold">Select Size</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-[48px] px-3 flex items-center justify-center border text-xs font-bold transition-all ${selectedSize === size ? 'bg-luxury-black text-white border-luxury-black' : 'bg-white text-luxury-black border-gray-200 hover:border-gold hover:text-gold'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-b border-gray-100 py-6">
            <h3 className="text-xs uppercase tracking-widest font-bold mb-4">The Details</h3>
            <p className="text-gray-600 font-normal leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsApp}
            className="w-full bg-luxury-black text-white py-5 uppercase tracking-[0.3em] text-[10px] font-bold flex items-center justify-center gap-4 transition-all hover:bg-gold hover:text-luxury-black"
          >
            <MessageCircle size={18} />
            <span>Inquire on WhatsApp</span>
          </motion.button>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <ShieldCheck size={20} />, title: '100% Authentic', sub: 'Money-back guarantee' },
              { icon: <Truck size={20} />, title: 'Secure Delivery', sub: 'Complimentary in UAE' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50">
                <div className="text-gold flex-shrink-0">{b.icon}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold">{b.title}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.93)' }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10">
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-xs uppercase tracking-widest font-bold bg-white/10 px-4 py-2">
              {lightboxIndex + 1} / {product.images.length}
            </div>

            {/* Prev */}
            {product.images.length > 1 && (
              <button onClick={e => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 flex items-center justify-center text-white z-10">
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                src={product.images[lightboxIndex]}
                alt={product.product_name}
                className="max-w-[90vw] max-h-[85vh] object-contain"
                referrerPolicy="no-referrer"
                onClick={e => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Next */}
            {product.images.length > 1 && (
              <button onClick={e => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 flex items-center justify-center text-white z-10">
                <ChevronRight size={28} />
              </button>
            )}

            {/* Thumbnail strip */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={e => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className={`w-12 h-12 border-2 overflow-hidden transition-all ${lightboxIndex === idx ? 'border-gold opacity-100' : 'border-white/20 opacity-40 hover:opacity-80'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/30 text-[9px] uppercase tracking-widest">
              ← → arrow keys to navigate · ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const FloatingWhatsApp = () => {
  const whatsappNumber = "+971505876447";
  
  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber.replace('+', '')}`}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <MessageCircle size={28} fill="currentColor" />
    </motion.a>
  );
};

export default FloatingWhatsApp;

import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxury-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6 col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-display tracking-tighter font-bold">LUX BAG</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold">by S & L</span>
            </Link>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              Your premier destination for authentic luxury bags in Dubai. Shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gold transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-gold transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-xs font-light">
              <li><Link to="/" className="hover:text-gold transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold">Our Promise</h4>
            <ul className="space-y-4 text-gray-400 text-xs font-light">
              <li><Link to="/about" className="hover:text-gold transition-colors">Authenticity Guarantee</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Inquiry</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">New Arrivals</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">WhatsApp Us</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs uppercase tracking-widest font-bold">Contact Info</h4>
            <ul className="space-y-4 text-gray-400 text-xs font-light">
              <li className="flex items-center space-x-3">
                <Phone size={14} className="text-gold" />
                <span>+971 50 587 6447</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={14} className="text-gold" />
                <span>shanejusteene@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={14} className="text-gold mt-1" />
                <span>Port Saeed, Dubai, UAE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-12 text-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Lux Bag by S and L. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

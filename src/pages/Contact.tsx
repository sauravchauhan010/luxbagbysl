import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

const Contact = () => {
  return (
    <div className="pb-24">
      <section className="bg-luxury-black text-white py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h1 className="text-5xl font-display">Contact Us</h1>
          <p className="text-gold uppercase tracking-widest text-xs">
            We're here to assist you
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gold-light rounded-full text-gold">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Phone & WhatsApp</p>
                    <p className="text-lg font-light">+971 50 587 6447</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gold-light rounded-full text-gold">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Email</p>
                    <p className="text-lg font-light">shanejusteene@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gold-light rounded-full text-gold">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Location</p>
                    <p className="text-lg font-light">Port Saeed, Dubai, United Arab Emirates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gold-light rounded-full text-gold">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold mb-1">Working Hours</p>
                    <p className="text-lg font-light">Mon - Sat: 10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="https://wa.me/971505876447"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury w-full flex items-center justify-center space-x-3"
              >
                <MessageCircle size={20} />
                <span>Chat with us on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="h-[500px] bg-gray-100 relative overflow-hidden shadow-2xl">
            {/* Placeholder for Map */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <MapPin size={48} className="text-gold" />
              <h3 className="text-2xl font-display">Find Us in Dubai</h3>
              <p className="text-gray-500 font-light max-w-xs">
                Port Saeed, Deira, Dubai. Visit our boutique to explore our collection in person.
              </p>
              <a 
                href="https://www.google.com/maps/search/Port+Saeed,+Dubai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest border-b border-luxury-black pb-1 hover:text-gold hover:border-gold transition-all"
              >
                Open in Google Maps
              </a>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1582653280643-e79c79219b19?auto=format&fit=crop&q=80&w=1000" 
              alt="Dubai Map Placeholder" 
              className="w-full h-full object-cover opacity-20"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

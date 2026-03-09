import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Heart, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="pb-24">
      {/* Header */}
      <section className="bg-gold-light py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h1 className="text-5xl font-display font-bold">Our Story</h1>
          <p className="text-luxury-black font-bold uppercase tracking-widest text-xs">
            Defining Luxury in Dubai Since 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-display leading-tight font-bold">
              Lux Bag by S and L is your premier destination for authentic luxury.
            </h2>
            <p className="text-gray-800 font-normal leading-relaxed text-lg">
              Founded with a passion for exquisite craftsmanship and timeless style, Lux Bag by S and L has grown into one of Dubai's most trusted boutiques for brand new and preloved luxury bags.
            </p>
            <p className="text-gray-800 font-normal leading-relaxed text-lg">
              Our mission is simple: to make luxury accessible while maintaining the highest standards of authenticity and customer service. Whether you're looking to buy your dream bag, sell an item from your collection, or consign with us, we provide a seamless and professional experience.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <p className="text-3xl font-display text-gold">100%</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Authentic</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-display text-gold">500+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold">Happy Clients</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://scontent.fdxb3-4.fna.fbcdn.net/v/t39.30808-6/482010531_625651703563974_8244584567202403563_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=101&ccb=1-7&_nc_sid=2a1932&_nc_ohc=m9DNBsf7UxsQ7kNvwGEC4Vm&_nc_oc=Adk-w3gGJcAF6dBFcFdcYn8E-JC8870b6AxFIZBNfngRBRFMh5VU3aaBnbEfVv48xK6yIcEx9Wq0Mx3kjMckO6kj&_nc_zt=23&_nc_ht=scontent.fdxb3-4.fna&_nc_gid=zgRXcOGL4CjHaLBEQpdHeg&_nc_ss=8&oh=00_AfwuXTU9dxLCF_NgQn_pzKmGr3t7NzDi8qnCZokNTNahyw&oe=69B49FE3"
              alt="Luxury Store"
              className="w-full h-auto shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-12 -left-12 bg-white p-8 shadow-xl hidden md:block max-w-xs">
              <p className="italic text-gray-500 font-light text-sm">
                "Luxury is not a necessity, but a way of life. We help you live it beautifully."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-luxury-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display mb-4">Our Core Values</h2>
            <div className="w-24 h-px bg-gold mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-4">
              <ShieldCheck className="text-gold mx-auto" size={32} />
              <h3 className="text-xl font-display">Authenticity</h3>
              <p className="text-gray-400 text-xs font-light">Zero tolerance for counterfeits.</p>
            </div>
            <div className="space-y-4">
              <Award className="text-gold mx-auto" size={32} />
              <h3 className="text-xl font-display">Quality</h3>
              <p className="text-gray-400 text-xs font-light">Only the finest curated pieces.</p>
            </div>
            <div className="space-y-4">
              <Heart className="text-gold mx-auto" size={32} />
              <h3 className="text-xl font-display">Passion</h3>
              <p className="text-gray-400 text-xs font-light">Driven by love for luxury fashion.</p>
            </div>
            <div className="space-y-4">
              <Star className="text-gold mx-auto" size={32} />
              <h3 className="text-xl font-display">Service</h3>
              <p className="text-gray-400 text-xs font-light">Personalized care for every client.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 overflow-visible ${
      scrolled
        ? 'bg-white/90 backdrop-blur-lg border-b border-gray-100 luxury-shadow'
        : 'bg-white/50 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo — overflows navbar like image 3 */}
          <Link to="/" className="flex items-center space-x-3 group" style={{ overflow: 'visible', position: 'relative' }}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              style={{
                width: 120, height: 120,
                position: 'relative',
                top: 20,
                flexShrink: 0,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #C9A84C',
                boxShadow: '0 8px 30px rgba(201,168,76,0.25)',
                background: 'white',
                zIndex: 60,
              }}
            >
              <img
                src="https://scontent.fdxb3-3.fna.fbcdn.net/v/t39.30808-1/461331705_511393141656498_7949530645421016791_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=-Ru6uhhmNUkQ7kNvwFjXhVY&_nc_oc=AdnJc5sBNj7HnUwv_aBDluEEVU83ipsFAk7bc1b4TN6w5Ygvm5R9i8OAYjTvptALkkP36JgUVYbj9XyDZl7mkMqu&_nc_zt=24&_nc_ht=scontent.fdxb3-3.fna&_nc_gid=zgRXcOGL4CjHaLBEQpdHeg&_nc_ss=8&oh=00_AfyKqDXsaXU6KdGo6UMJU8pBtGQY7NkJj3QQfIni8Wxokg&oe=69B49233"
                alt="Lux Bag Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-display tracking-tighter font-bold leading-none group-hover:text-gold transition-colors">LUX BAG</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1 font-medium">by S & L</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-xs uppercase tracking-widest transition-all hover:text-gold group ${
                  location.pathname === link.path ? 'text-gold font-bold' : 'text-luxury-black font-medium'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full ${
                  location.pathname === link.path ? 'w-full' : ''
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/shop" className="p-2 hover:text-gold transition-colors">
                <ShoppingBag size={20} />
              </Link>
            </motion.div>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:text-gold transition-colors">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm uppercase tracking-widest py-2 border-b border-gray-50"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

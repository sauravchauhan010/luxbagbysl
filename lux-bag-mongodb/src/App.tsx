import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ScrollToTop from './components/ScrollToTop';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

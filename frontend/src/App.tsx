import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SiteDataProvider } from './context/SiteDataContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import ProtectedRoute from './admin/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import RepairRequest from './pages/RepairRequest';
import About from './pages/About';
import Contact from './pages/Contact';
// import Banners from './pages/Banners';
import NotFound from './pages/NotFound';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/AdminProducts';
import AdminProductForm from './admin/AdminProductForm';
import AdminCategories from './admin/AdminCategories';
import AdminBanners from './admin/AdminBanners';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminRepairRequests from './admin/AdminRepairRequests';
import AdminMessages from './admin/AdminMessages';
import AdminContent from './admin/AdminContent';
import AdminContactInfo from './admin/AdminContactInfo';
import AdminSettings from './admin/AdminSettings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <SiteDataProvider>
          <CartProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#0a1f35',
                  color: '#e8f4fd',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/category/:slug" element={<Layout><Category /></Layout>} />
              <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/repair" element={<Layout><RepairRequest /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              {/* Banners are now displayed on the Home page */}

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id/edit" element={<AdminProductForm />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="repair-requests" element={<AdminRepairRequests />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="contact-info" element={<AdminContactInfo />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </CartProvider>
        </SiteDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

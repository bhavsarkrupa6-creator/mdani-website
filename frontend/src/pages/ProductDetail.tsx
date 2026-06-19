import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Mail, ChevronLeft, ChevronRight, Check, X as XIcon, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Product } from '../types';
import { useSiteData } from '../context/SiteDataContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, getEffectivePrice, getDiscountPercent, getProductImage, buildWhatsAppLink } from '../utils/helpers';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { contactInfo } = useSiteData();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true); setActiveImage(0);
    api.get(`/products/${slug}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner full size="lg" />;
  if (!product) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display font-bold text-2xl text-white mb-2">Product not found</h1>
      <Link to="/products" className="inline-flex px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm mt-4">Browse Products</Link>
    </div>
  );

  const images = [product.image, ...(product.galleryImages || [])].filter(Boolean) as string[];
  const displayImages = images.length > 0 ? images : ['/placeholder-product.svg'];
  const effectivePrice = getEffectivePrice(product.price, product.discountPrice);
  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const inStock = product.stockStatus === 'IN_STOCK';
  const categoryName = product.category && 'name' in product.category ? product.category.name : '';
  const inCartAlready = isInCart(product.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    setSubmitting(true);
    try {
      await api.post('/site/messages', { ...form, productId: product.id });
      toast.success('Inquiry sent!');
      setForm({ name: '', phone: '', email: '', message: '' });
      setShowInquiry(false);
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const inputCls = "w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-navy-300/40";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <p className="text-xs text-navy-500 mb-5">
        <Link to="/" className="hover:text-navy-300">Home</Link> /{' '}
        {categoryName && (
          <><Link to={`/category/${product.category && 'slug' in product.category ? product.category.slug : ''}`} className="hover:text-navy-300">{categoryName}</Link> / </>
        )}
        <span className="text-navy-300">{product.name}</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-white/5">
            <img src={getProductImage(displayImages[activeImage])} alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }} />
            {discountPercent && (
              <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-bold">-{discountPercent}%</span>
            )}
            {displayImages.length > 1 && (
              <>
                <button onClick={() => setActiveImage((i) => (i - 1 + displayImages.length) % displayImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button onClick={() => setActiveImage((i) => (i + 1) % displayImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
          {displayImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
              {displayImages.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-navy-300' : 'border-white/10'}`}>
                  <img src={getProductImage(img)} alt="" className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {categoryName && <span className="text-xs font-bold text-navy-400 uppercase tracking-widest">{categoryName}</span>}
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              inStock ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {inStock ? <Check className="w-3.5 h-3.5" /> : <XIcon className="w-3.5 h-3.5" />}
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.brand && <span className="text-xs font-semibold text-navy-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">Brand: {product.brand}</span>}
          </div>

          <div className="flex items-end gap-3 mb-6">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">{formatPrice(effectivePrice)}</span>
            {discountPercent && <span className="text-lg text-navy-500 line-through pb-1">{formatPrice(product.price)}</span>}
          </div>

          {product.description && <p className="text-sm text-navy-300 leading-relaxed mb-6">{product.description}</p>}

          {product.features && product.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-sm text-white mb-3">Features</h3>
              <ul className="space-y-2">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-navy-300">
                    <Check className="w-4 h-4 text-navy-400 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mb-6">
              <h3 className="font-display font-semibold text-sm text-white mb-3">Specifications</h3>
              <div className="bg-surface border border-white/5 rounded-xl overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div key={key} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                    <span className="font-medium text-navy-400">{key}</span>
                    <span className="text-white text-right">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {inStock && (
              <button onClick={() => { addToCart(product); toast.success('Added to cart!'); }}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  inCartAlready
                    ? 'bg-navy-900/80 border border-navy-300/30 text-navy-300'
                    : 'bg-navy-900 border border-white/10 text-white hover:bg-navy-700 hover:border-navy-300/30'
                }`}>
                {inCartAlready ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                {inCartAlready ? 'In Cart' : 'Add to Cart'}
              </button>
            )}
            {contactInfo?.whatsapp && (
              <a href={buildWhatsAppLink(contactInfo.whatsapp, product.name)} target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-opacity">
                <MessageCircle className="w-5 h-5" /> Order on WhatsApp
              </a>
            )}
          </div>
          <button onClick={() => setShowInquiry((s) => !s)}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-card border border-white/10 text-navy-300 font-semibold text-sm hover:bg-white/5 hover:text-white transition-colors">
            <Mail className="w-4 h-4" /> Email Inquiry
          </button>

          {showInquiry && (
            <form onSubmit={handleSubmit} className="mt-4 bg-surface border border-white/5 rounded-2xl p-5 space-y-3 animate-slide-up">
              <h3 className="font-display font-semibold text-sm text-white">Send an Inquiry</h3>
              <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
              <input type="email" placeholder="Email Address *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputCls} />
              <textarea placeholder="Your message..." rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className={`${inputCls} resize-none`} />
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-navy-300 text-navy-950 font-bold py-3 text-sm disabled:opacity-60">
                {submitting ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

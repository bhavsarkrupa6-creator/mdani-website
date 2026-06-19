import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, ShieldCheck, BadgeCheck, Wrench, Zap, Star } from 'lucide-react';
import api from '../utils/api';
import { useSiteData } from '../context/SiteDataContext';
import { Product, Testimonial } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import CategoryCard from '../components/CategoryCard';
import Accordion from '../components/Accordion';
import BannerCarousel from '../components/BannerCarousel';
import { Banner } from '../types';
import { buildWhatsAppLink } from '../utils/helpers';

const CATEGORIES = [
  { slug: 'playstation',    name: 'PlayStation',    emoji: '🎮', desc: 'PS5 & PS4' },
  { slug: 'xbox',           name: 'Xbox',           emoji: '🕹️', desc: 'Series X/S & One' },
  { slug: 'nintendo',       name: 'Nintendo',       emoji: '🃏', desc: 'Switch & Games' },
  { slug: 'games',          name: 'Games',          emoji: '💿', desc: 'All Platforms' },
  { slug: 'accessories',    name: 'Accessories',    emoji: '🎧', desc: 'Controllers & More' },
  { slug: 'consoles',       name: 'Consoles',       emoji: '📺', desc: 'All Consoles' },
  { slug: 'pre-owned',      name: 'Pre-Owned',      emoji: '♻️', desc: 'Save More' },
  { slug: 'repair-services',name: 'Repairs',        emoji: '🛠️', desc: 'Expert Service' },
];

const WHY = [
  { icon: BadgeCheck, title: 'Genuine Products',  desc: 'Every item verified for authenticity' },
  { icon: ShieldCheck, title: 'Warranty Support', desc: 'Backed by manufacturer warranty' },
  { icon: Zap,         title: 'Fast Service',     desc: 'Quick turnaround on all orders' },
  { icon: Wrench,      title: 'Expert Repairs',   desc: 'Skilled console technicians' },
];

const Home: React.FC = () => {
  const { contactInfo, siteContent, categories } = useSiteData();
  const [featured,  setFeatured]  = useState<Product[]>([]);
  const [newArrivals, setNew]     = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [afterHeroBanners, setAfterHeroBanners] = useState<Banner[]>([]);
  const [afterProductsBanners, setAfterProductsBanners] = useState<Banner[]>([]);
  const [loadF, setLoadF] = useState(true);
  const [loadN, setLoadN] = useState(true);

  useEffect(() => {
    api.get('/products', { params: { featured: 'true', limit: 8 } })
      .then(r => setFeatured(r.data.products || [])).finally(() => setLoadF(false));
    api.get('/products', { params: { limit: 8 } })
      .then(r => setNew(r.data.products || [])).finally(() => setLoadN(false));
    api.get('/testimonials').then(r => setTestimonials(r.data.testimonials || []));
    
    // Fetch banners
    api.get('/banners', { params: { location: 'AFTER_HERO' } })
      .then(r => setAfterHeroBanners(r.data.banners?.slice(0, 5) || []));
    api.get('/banners', { params: { location: 'AFTER_PRODUCTS' } })
      .then(r => setAfterProductsBanners(r.data.banners?.slice(0, 5) || []));
  }, []);

  const topCats = categories.filter(c => !c.parentId);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[500px] sm:min-h-[580px] flex items-center">
       <div className="absolute inset-0" style={{backgroundImage:'url(/hero-bg.jpg)',backgroundSize:'cover',backgroundPosition:'center'}} />
<div className="absolute inset-0" style={{background:'rgba(7,21,33,0.55)'}} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.55}} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/70 border border-navy-300/15 text-navy-300 text-xs font-semibold mb-6 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Trusted Local Gaming Store
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] mb-5">
              {siteContent?.heroTitle || <><span>Level Up</span><br /><span className="gradient-text">Your Game</span></>}
            </h1>
            <p className="text-navy-300 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {siteContent?.heroSubtitle || 'Genuine consoles, games & accessories with expert repair services. Your one-stop gaming destination.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-navy-300 text-navy-950 font-bold text-sm hover:bg-white transition-colors shadow-glow">
                {siteContent?.heroCtaText || 'Shop Now'} <ArrowRight className="w-4 h-4" />
              </Link>
              {contactInfo?.whatsapp && (
                <a href={buildWhatsAppLink(contactInfo.whatsapp)} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors backdrop-blur-sm">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Order
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* AFTER HERO BANNERS */}
      {afterHeroBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BannerCarousel banners={afterHeroBanners} />
        </section>
      )}

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-1.5">Browse</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Shop by Category</h2>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-navy-400 hover:text-navy-100 transition-colors">
            All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {(topCats.length > 0 ? topCats : CATEGORIES).map((cat, i) => {
            const vis = CATEGORIES.find(c => c.slug === (cat as any).slug);
            return (
              <CategoryCard
                key={(cat as any).id || (cat as any).slug}
                id={(cat as any).id}
                name={cat.name}
                slug={(cat as any).slug}
                image={(cat as any).image}
                description={vis?.desc}
                index={i}
              />
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#0d1e2f] border-y border-white/5 py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-1.5">Handpicked</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Featured Products</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-navy-400 hover:text-navy-100 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {loadF
              ? Array.from({length:8}).map((_,i) => <ProductCardSkeleton key={i} />)
              : featured.length > 0
                ? featured.map(p => <ProductCard key={p.id} product={p} />)
                : <div className="col-span-full text-center py-16 text-navy-500 text-sm">No featured products yet. Mark products as featured in the admin panel.</div>}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-1.5">Just In</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">New Arrivals</h2>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-navy-400 hover:text-navy-100 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {loadN
            ? Array.from({length:8}).map((_,i) => <ProductCardSkeleton key={i} />)
            : newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* AFTER PRODUCTS BANNERS */}
      {afterProductsBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BannerCarousel banners={afterProductsBanners} />
        </section>
      )}

      {/* WHY CHOOSE US */}
      <section className="bg-[#0d1e2f] border-y border-white/5 py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-2">Why Us</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Why Choose Mdani Games</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY.map((item, i) => (
              <motion.div key={item.title}
                initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}} transition={{duration:0.3,delay:i*0.07}}
                className="flex flex-col items-center text-center gap-3 bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 sm:p-6">
                <div className="w-12 h-12 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-navy-300" />
                </div>
                <h3 className="font-display font-semibold text-sm text-white">{item.title}</h3>
                <p className="text-xs text-navy-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-2">Reviews</p>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">What Gamers Say</h2>
            <p className="text-navy-400 text-sm mt-3 max-w-md mx-auto">Don't just take our word for it. See what our community of gamers has to say about our products and services.</p>
          </div>
          <Accordion items={testimonials} />
        </section>
      )}

      {/* WHATSAPP CTA */}
      {contactInfo?.whatsapp && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 px-6 sm:px-12 py-12 sm:py-16 text-center"
            style={{background:'linear-gradient(135deg,#071e35 0%,#0a2a44 50%,#071e35 100%)'}}>
            <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{background:'#7BBDE8'}} />
            <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{background:'#4E8EA2'}} />
            <div className="relative">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">Got a question? We're on WhatsApp!</h2>
              <p className="text-navy-300 text-sm sm:text-base mb-6 max-w-lg mx-auto">Ask about stock, pricing or repairs — we respond fast and personally.</p>
              <a href={buildWhatsAppLink(contactInfo.whatsapp)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] text-white font-bold text-sm sm:text-base hover:opacity-90 transition-opacity shadow-glow">
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

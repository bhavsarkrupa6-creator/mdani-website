import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Gamepad2, ShoppingCart, ChevronDown } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

const NAV_LINKS = [
  {
    label: 'PlayStation', to: '/category/playstation',
    children: [
      { label: 'PS5 Consoles', to: '/category/ps5-consoles' },
      { label: 'PS4 Consoles', to: '/category/ps4-consoles' },
      { label: 'PS5 Games',    to: '/category/ps5-games' },
      { label: 'PS4 Games',    to: '/category/ps4-games' },
      { label: 'Controllers',  to: '/category/ps-controllers' },
      { label: 'Headsets',     to: '/category/ps-headsets' },
    ],
  },
  {
    label: 'Xbox', to: '/category/xbox',
    children: [
      { label: 'Xbox Series X/S', to: '/category/xbox' },
      { label: 'Xbox Games',      to: '/category/games' },
      { label: 'Accessories',     to: '/category/accessories' },
    ],
  },
  { label: 'Nintendo',    to: '/category/nintendo' },
  { label: 'Games',       to: '/category/games' },
  { label: 'Accessories', to: '/category/accessories' },
  { label: 'Pre-Owned',   to: '/category/pre-owned' },
  { label: 'Repairs',     to: '/repair' },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState('');
  const [cartOpen,   setCartOpen]   = useState(false);
  const navigate    = useNavigate();
  const { contactInfo } = useSiteData();
  const { totalItems }  = useCart();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, cartOpen]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 60);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery(''); setSearchOpen(false); setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="hidden lg:block bg-[#071521] border-b border-white/5 text-xs text-navy-400 py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <span>🎮 Genuine Products &nbsp;·&nbsp; Warranty Support &nbsp;·&nbsp; Expert Repairs</span>
          {contactInfo?.phone && (
            <a href={`tel:${contactInfo.phone}`} className="hover:text-navy-100 transition-colors">
              📞 {contactInfo.phone}
            </a>
          )}
        </div>
      </div>

      {/* Main header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#0d1f33]/95 backdrop-blur-xl border-white/8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-[#0f2035] border-white/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow-sm group-hover:scale-105 transition-transform">
              <img src="/logo-mg.png" alt="MG Logo" className="w-full h-full object-cover brightness-125 contrast-125" />
            </div>
            <div className="leading-tight">
              <p className="font-display font-bold text-white text-xs sm:text-sm tracking-tight">MDANI Games</p>
              <p className="text-[9px] sm:text-[10px] text-cyan-400 font-semibold -mt-0.5">& Services</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.to} className="dropdown relative">
                  <Link to={link.to}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <div className="dropdown-menu absolute top-full left-0 pt-2 z-50 min-w-[180px] animate-slide-down">
                    <div className="bg-[#0f2035] border border-white/10 rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden py-1.5">
                      {link.children.map((c) => (
                        <Link key={c.to} to={c.to}
                          className="block px-4 py-2.5 text-sm text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink key={link.to} to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'text-white bg-white/10' : 'text-navy-300 hover:text-white hover:bg-white/5'
                    }`
                  }>
                  {link.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="hidden sm:flex items-center">
                <input ref={searchRef} type="text" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-56 lg:w-72 rounded-l-xl bg-[#0b1929] border border-white/10 px-4 py-2 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-navy-300/30" />
                <button type="submit"
                  className="px-4 py-2 rounded-r-xl bg-navy-900 border border-l-0 border-white/10 text-navy-300 hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 p-2 text-navy-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-navy-300 text-navy-950 text-[10px] font-bold flex items-center justify-center px-1 leading-none">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="sm:hidden px-4 pb-3 animate-slide-down">
            <form onSubmit={handleSearch} className="flex">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..." autoFocus
                className="flex-1 rounded-l-xl bg-[#0b1929] border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none" />
              <button type="submit" className="px-4 rounded-r-xl bg-navy-900 border border-l-0 border-white/10 text-navy-300">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[82%] max-w-xs bg-[#0f2035] border-r border-white/8 flex flex-col shadow-[4px_0_40px_rgba(0,0,0,0.5)] animate-slide-up">
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <img src="/logo-mg.png" alt="MG Logo" className="w-full h-full object-cover brightness-125 contrast-125" />
                </div>
                <span className="font-display font-bold text-white text-sm">MDANI Games</span>
              </div>
              <button onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <div key={link.to}>
                  <NavLink to={link.to} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive ? 'bg-navy-900/60 text-white' : 'text-navy-300 hover:text-white hover:bg-white/5'
                      }`
                    }>{link.label}</NavLink>
                  {link.children && (
                    <div className="ml-4 space-y-0.5 mb-1">
                      {link.children.map((c) => (
                        <Link key={c.to} to={c.to} onClick={() => setMobileOpen(false)}
                          className="block px-4 py-2 rounded-lg text-xs text-navy-500 hover:text-navy-100 hover:bg-white/5 transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {[['About Us','/about'],['Contact','/contact']].map(([l,t]) => (
                <NavLink key={t} to={t} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'bg-navy-900/60 text-white' : 'text-navy-300 hover:text-white hover:bg-white/5'
                    }`
                  }>{l}</NavLink>
              ))}
            </nav>
            {contactInfo?.whatsapp && (
              <div className="p-4 border-t border-white/8">
                <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g,'')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] text-white font-bold py-3 text-sm">
                  💬 Chat on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;

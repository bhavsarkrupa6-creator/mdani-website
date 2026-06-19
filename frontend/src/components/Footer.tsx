import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

const Footer: React.FC = () => {
  const { contactInfo, siteContent } = useSiteData();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#071521] border-t border-white/5 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src="/logo-mg.png" alt="MG Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base">MDANI Games</p>
              <p className="text-xs text-cyan-400 font-semibold -mt-0.5">& Services</p>
            </div>
          </div>
          <p className="text-sm text-navy-400 leading-relaxed">
            {siteContent?.footerContent || 'Your trusted local gaming store for consoles, games, accessories and repairs.'}
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {[['PlayStation','/category/playstation'],['Xbox','/category/xbox'],['Nintendo','/category/nintendo'],
              ['Games','/category/games'],['Accessories','/category/accessories'],['Pre-Owned','/category/pre-owned']
            ].map(([l,t]) => (
              <li key={t}><Link to={t} className="text-navy-400 hover:text-navy-100 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-4">Help</h4>
          <ul className="space-y-2.5 text-sm">
            {[['Repair Services','/repair'],['About Us','/about'],['Contact Us','/contact'],['All Products','/products']
            ].map(([l,t]) => (
              <li key={t}><Link to={t} className="text-navy-400 hover:text-navy-100 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            {contactInfo?.phone && (
              <li><a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2.5 text-navy-400 hover:text-navy-100 transition-colors"><Phone className="w-4 h-4 shrink-0" />{contactInfo.phone}</a></li>
            )}
            {contactInfo?.whatsapp && (
              <li><a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-navy-400 hover:text-green-400 transition-colors"><MessageCircle className="w-4 h-4 shrink-0" />WhatsApp Us</a></li>
            )}
            {contactInfo?.email && (
              <li><a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2.5 text-navy-400 hover:text-navy-100 transition-colors"><Mail className="w-4 h-4 shrink-0" /><span className="break-all">{contactInfo.email}</span></a></li>
            )}
            {contactInfo?.address && (
              <li className="flex items-start gap-2.5 text-navy-400"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /><span>{contactInfo.address}</span></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-navy-600">
          <p>© {year} Mdani Games & Services. All rights reserved.</p>
          <p>Genuine · Trusted · Expert</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

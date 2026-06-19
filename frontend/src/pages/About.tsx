import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BadgeCheck, Wrench, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { buildWhatsAppLink } from '../utils/helpers';

const VALUES = [
  { icon: BadgeCheck, title: 'Authenticity First', desc: 'We only stock genuine products sourced through trusted channels.' },
  { icon: ShieldCheck, title: 'Built on Trust',   desc: 'Years of honest service to the local gaming community.' },
  { icon: Wrench,      title: 'Skilled Repairs',  desc: 'Expert technicians for all console and controller issues.' },
  { icon: Zap,         title: 'Fast & Reliable',  desc: 'Quick processing and clear communication every step of the way.' },
];

const About: React.FC = () => {
  const { siteContent, contactInfo } = useSiteData();
  return (
    <div>
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#071521 0%,#0d2a44 60%,#071521 100%)'}}>
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:'linear-gradient(rgba(123,189,232,1) 1px,transparent 1px),linear-gradient(90deg,rgba(123,189,232,1) 1px,transparent 1px)',backgroundSize:'64px 64px'}} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-navy-900/70 border border-navy-300/15 text-navy-300 text-xs font-semibold mb-6">Our Story</span>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white leading-tight mb-5">About Mdani Games</h1>
          <p className="text-navy-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {siteContent?.aboutUsContent || 'Mdani Games & Sales Service is your trusted local destination for gaming consoles, games, accessories, and repair services.'}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400 mb-2">What We Stand For</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map(v => (
            <div key={v.title} className="bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center">
                <v.icon className="w-6 h-6 text-navy-300" />
              </div>
              <h3 className="font-display font-semibold text-sm text-white">{v.title}</h3>
              <p className="text-xs text-navy-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 px-6 sm:px-12 py-10 sm:py-14 text-center"
          style={{background:'linear-gradient(135deg,#071e35 0%,#0a2a44 100%)'}}>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">Ready to find your next game?</h2>
          <p className="text-navy-300 text-sm sm:text-base mb-6 max-w-lg mx-auto">Browse our catalog or message us directly.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-navy-300 text-navy-950 font-bold text-sm hover:bg-white transition-colors">
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            {contactInfo?.whatsapp && (
              <a href={buildWhatsAppLink(contactInfo.whatsapp)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-sm hover:opacity-90 transition-opacity">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default About;

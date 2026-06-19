import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { buildWhatsAppLink } from '../utils/helpers';

const WhatsAppFloat: React.FC = () => {
  const { contactInfo } = useSiteData();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  if (!contactInfo?.whatsapp) return null;
  return (
    <a href={buildWhatsAppLink(contactInfo.whatsapp)} target="_blank" rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-110 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
      <MessageCircle className="w-7 h-7" fill="white" />
    </a>
  );
};
export default WhatsAppFloat;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  name: string;
  message: string;
  rating: number;
  image?: string | null;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ name, message, rating, image, isOpen, onClick }) => {
  return (
    <div className="border border-white/5 bg-card rounded-2xl overflow-hidden mb-3 transition-all duration-300 hover:border-white/10">
      <button
        onClick={onClick}
        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
      >
        <div className="flex items-center gap-3">
          {image ? (
            <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-navy-900 border border-white/10 flex items-center justify-center font-bold text-navy-300 text-sm">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base">{name}</h4>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-navy-700'}`} />
              ))}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-navy-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px bg-white/5 mb-4" />
              <p className="text-sm sm:text-base text-navy-300 leading-relaxed italic">
                "{message}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface AccordionProps {
  items: any[];
}

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  return (
    <div className="max-w-3xl mx-auto">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          {...item}
          isOpen={openId === item.id}
          onClick={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
};

export default Accordion;

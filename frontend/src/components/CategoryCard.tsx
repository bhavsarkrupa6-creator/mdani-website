import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  index?: number;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  name, 
  slug, 
  image, 
  description, 
  onClick 
}) => {
  const href = slug === 'repair-services' ? '/repair' : `/category/${slug}`;

  return (
    <div className="relative h-full">
      <Link
        to={href}
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-br from-[#0f2035]/60 to-[#0a1929]/40 backdrop-blur-md border border-white/8 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 hover:border-cyan-400/40 hover:from-[#172f4a]/80 hover:to-[#0d2340]/60 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl hover:shadow-2xl min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]"
      >
        {/* Premium Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/0 via-cyan-400/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

        {/* Image Container */}
        <div className="relative w-24 sm:w-28 lg:w-32 h-24 sm:h-28 lg:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0b1e30] to-[#051219] border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-500 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-5xl sm:text-6xl">🎮</div>
          )}
        </div>

        {/* Content */}
        <div className="relative flex-1 flex flex-col justify-center">
          <h3 className="font-display font-bold text-lg sm:text-xl lg:text-2xl text-white group-hover:text-cyan-300 transition-colors tracking-tight">
            {name}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-navy-400 mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}
        </div>

        {/* Arrow Icon */}
        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-cyan-400/20 transition-all duration-300 transform group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4 text-cyan-300" />
        </div>

        {/* Floating Animation Element */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400/30"
        />
      </Link>
    </div>
  );
};

export default CategoryCard;
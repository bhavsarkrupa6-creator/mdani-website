import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ eyebrow, title, subtitle, align = 'left' }) => {
  return (
    <div className={`mb-8 ${align === 'center' ? 'text-center' : ''}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy-500 mb-2">{eyebrow}</p>
      )}
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">{title}</h2>
      {subtitle && <p className="mt-2 text-navy-300 text-sm sm:text-base max-w-2xl">{subtitle}</p>}
    </div>
  );
};

export default SectionHeading;

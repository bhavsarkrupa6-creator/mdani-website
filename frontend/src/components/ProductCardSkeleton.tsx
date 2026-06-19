import React from 'react';
const ProductCardSkeleton: React.FC = () => (
  <div className="bg-card border border-white/5 rounded-2xl overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-[#0b1e30]" />
    <div className="p-4 space-y-3">
      <div className="h-2 w-1/3 bg-white/5 rounded" />
      <div className="h-3.5 w-full bg-white/5 rounded" />
      <div className="h-3.5 w-2/3 bg-white/5 rounded" />
      <div className="flex justify-between items-center mt-3">
        <div className="h-5 w-1/3 bg-white/5 rounded" />
        <div className="h-7 w-1/4 bg-white/5 rounded-lg" />
      </div>
    </div>
  </div>
);
export default ProductCardSkeleton;

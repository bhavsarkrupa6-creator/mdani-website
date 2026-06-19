import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import api from '../utils/api';
import { Category } from '../types';

export interface ProductFiltersState {
  category: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  stockStatus: string;
  sort: string;
}

const inputCls = "w-full rounded-xl bg-surface border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-navy-300/40 focus:ring-1 focus:ring-navy-300/20";

const ProductFilters: React.FC<{
  filters: ProductFiltersState;
  onChange: (f: ProductFiltersState) => void;
  categories: Category[];
}> = ({ filters, onChange, categories }) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    api.get('/products/meta/brands').then((res) => setBrands(res.data.brands || [])).catch(() => {});
  }, []);

  const update = (key: keyof ProductFiltersState, value: string) => onChange({ ...filters, [key]: value });
  const clearAll = () => onChange({ category: '', minPrice: '', maxPrice: '', brand: '', stockStatus: '', sort: '' });
  const hasActive = Object.values(filters).some((v) => v !== '');

  const body = (
    <div className="space-y-5">
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-2">Sort By</label>
        <select value={filters.sort} onChange={(e) => update('sort', e.target.value)} className={inputCls}>
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-2">Category</label>
        <select value={filters.category} onChange={(e) => update('category', e.target.value)} className={inputCls}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-2">Price Range (₹)</label>
        <div className="flex gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} className={inputCls} />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} className={inputCls} />
        </div>
      </div>
      {brands.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-2">Brand</label>
          <select value={filters.brand} onChange={(e) => update('brand', e.target.value)} className={inputCls}>
            <option value="">All Brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      )}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-widest text-navy-400 mb-2">Availability</label>
        <select value={filters.stockStatus} onChange={(e) => update('stockStatus', e.target.value)} className={inputCls}>
          <option value="">All</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>
      {hasActive && (
        <button onClick={clearAll} className="w-full text-sm font-semibold text-navy-400 hover:text-white underline">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-white/10 text-sm font-semibold text-white">
          <SlidersHorizontal className="w-4 h-4" /> Filters & Sort
          {hasActive && <span className="w-2 h-2 rounded-full bg-navy-300" />}
        </button>
      </div>
      <div className="hidden lg:block w-56 shrink-0">
        <div className="bg-card border border-white/5 rounded-2xl p-5 sticky top-20">
          <h3 className="font-display font-bold text-white mb-4">Filters</h3>
          {body}
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-card border-t border-white/10 rounded-t-3xl p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white text-lg">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
            {body}
            <button onClick={() => setMobileOpen(false)} className="w-full mt-5 rounded-xl bg-navy-300 text-navy-950 font-bold py-3 text-sm">
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;

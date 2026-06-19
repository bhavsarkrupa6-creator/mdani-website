import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import api from '../utils/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const SORTS = [
  { value: '',           label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
];

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sort,        setSort]        = useState(searchParams.get('sort') || '');

  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params: Record<string,string> = { page: String(page), limit: '20' };
    if (search) params.search = search;
    if (sort)   params.sort   = sort;
    api.get('/products', { params })
      .then(r => {
        setProducts(r.data.products || []);
        setTotalPages(r.data.pagination?.totalPages || 1);
        setTotal(r.data.pagination?.total || 0);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [search, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Record<string,string> = {};
    if (searchInput.trim()) p.search = searchInput.trim();
    if (sort) p.sort = sort;
    setSearchParams(p);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            {search ? `Results for "${search}"` : 'All Products'}
          </h1>
          {!loading && <p className="text-sm text-navy-400 mt-1">{total} products</p>}
        </div>

        {/* Sort + Search row */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="relative">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="w-44 sm:w-56 rounded-xl bg-card border border-white/8 px-4 py-2.5 pr-9 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-navy-300/30" />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-100">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="rounded-xl bg-card border border-white/8 px-3 py-2.5 text-sm text-navy-300 focus:outline-none focus:border-navy-300/30 cursor-pointer">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {loading
          ? Array.from({length:20}).map((_,i) => <ProductCardSkeleton key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-24">
          <p className="text-navy-500 text-sm">No products found.</p>
          {search && (
            <button onClick={() => { setSearchInput(''); setSearchParams({}); }}
              className="mt-3 text-sm font-semibold text-navy-300 hover:text-white underline">
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({length:totalPages}).map((_,i) => (
            <button key={i} onClick={() => setPage(i+1)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                page===i+1
                  ? 'bg-navy-300 text-navy-950'
                  : 'bg-card border border-white/8 text-navy-400 hover:bg-white/5 hover:text-white'
              }`}>
              {i+1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

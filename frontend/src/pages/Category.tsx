import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const SORTS = [
  { value: '',           label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc',   label: 'Name: A → Z' },
];

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category,    setCategory]    = useState<Category | null>(null);
  const [products,    setProducts]    = useState<Product[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [activeSubcat,setActiveSubcat]= useState('');
  const [sort,        setSort]        = useState('');

  useEffect(() => {
    setActiveSubcat(''); setSort('');
    api.get(`/categories/${slug}`).then(r => setCategory(r.data.category)).catch(() => setCategory(null));
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const params: Record<string,string> = { limit: '40' };
    params.category = activeSubcat || slug;
    if (sort) params.sort = sort;
    api.get('/products', { params })
      .then(r => setProducts(r.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug, activeSubcat, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-navy-500 mb-4">
        <Link to="/" className="hover:text-navy-300 transition-colors">Home</Link>
        {' / '}
        <span className="text-navy-300">{category?.name || slug}</span>
      </p>

      {/* Title + sort */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">{category?.name || 'Category'}</h1>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="rounded-xl bg-card border border-white/8 px-3 py-2.5 text-sm text-navy-300 focus:outline-none focus:border-navy-300/30 cursor-pointer">
          {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {category?.description && (
        <p className="text-sm text-navy-400 max-w-2xl mb-5">{category.description}</p>
      )}

      {/* Subcategory chips */}
      {category?.children && category.children.length > 0 && (
        <div className="flex gap-2 overflow-x-auto py-4 mb-2 scrollbar-hide">
          <button onClick={() => setActiveSubcat('')}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeSubcat==='' ? 'bg-navy-300 text-navy-950 border-transparent' : 'bg-card border-white/10 text-navy-400 hover:text-white'
            }`}>All</button>
          {category.children.map(sub => (
            <button key={sub.id} onClick={() => setActiveSubcat(sub.slug)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                activeSubcat===sub.slug ? 'bg-navy-300 text-navy-950 border-transparent' : 'bg-card border-white/10 text-navy-400 hover:text-white'
              }`}>{sub.name}</button>
          ))}
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 mt-4">
        {loading
          ? Array.from({length:10}).map((_,i) => <ProductCardSkeleton key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {!loading && products.length === 0 && (
        <div className="text-center py-24 text-navy-500 text-sm">No products in this category yet.</div>
      )}
    </div>
  );
};

export default CategoryPage;

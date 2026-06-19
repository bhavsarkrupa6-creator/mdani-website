import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice, getProductImage } from '../utils/helpers';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = () => {
    setLoading(true);
    api
      .get('/products/admin/all')
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStock = async (product: Product) => {
    const newStatus = product.stockStatus === 'IN_STOCK' ? 'OUT_OF_STOCK' : 'IN_STOCK';
    try {
      await api.patch(`/products/${product.id}/stock`, { stockStatus: newStatus });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, stockStatus: newStatus } : p)));
    } catch {
      toast.error('Failed to update stock status');
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await api.patch(`/products/${product.id}/visibility`, { isPublished: !product.isPublished });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isPublished: !product.isPublished } : p)));
    } catch {
      toast.error('Failed to update visibility');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Products</h1>
          <p className="text-sm text-navy-300">{products.length} total products</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="admin-input pr-10"
        />
        <Search className="w-4 h-4 text-navy-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="admin-card overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-bold uppercase tracking-wide text-navy-400">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProductImage(p.image)}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-surface"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }}
                      />
                      <span className="font-medium text-white line-clamp-1 max-w-[220px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-navy-300">{p.category && 'name' in p.category ? p.category.name : '-'}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    {formatPrice(p.discountPrice || p.price)}
                    {p.discountPrice && <span className="block text-xs text-navy-400 line-through">{formatPrice(p.price)}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStock(p)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                        p.stockStatus === 'IN_STOCK' ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                      }`}
                    >
                      {p.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisibility(p)} className="flex items-center gap-1.5 text-xs font-semibold text-navy-300">
                      {p.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      {p.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/${p.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-navy-300">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {filtered.map((p) => (
            <div key={p.id} className="p-4 flex gap-3">
              <img
                src={getProductImage(p.image)}
                alt=""
                className="w-14 h-14 rounded-lg object-cover bg-surface shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.svg'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm line-clamp-1">{p.name}</p>
                <p className="text-xs text-navy-400 mb-1.5">{p.category && 'name' in p.category ? p.category.name : '-'}</p>
                <p className="text-sm font-semibold text-white mb-2">{formatPrice(p.discountPrice || p.price)}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => toggleStock(p)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stockStatus === 'IN_STOCK' ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-red-500/10 text-red-400 border border-red-500/15'
                    }`}
                  >
                    {p.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                  </button>
                  <button onClick={() => toggleVisibility(p)} className="flex items-center gap-1 text-xs font-semibold text-navy-300 px-2.5 py-1 rounded-full bg-surface">
                    {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {p.isPublished ? 'Published' : 'Hidden'}
                  </button>
                  <Link to={`/admin/products/${p.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface text-navy-300">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-navy-400 text-sm">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

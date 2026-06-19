import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Category, StockStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { SingleImageUploader, MultiImageUploader } from './ImageUploader';

interface SpecRow {
  key: string;
  value: string;
}

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('IN_STOCK');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [image, setImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [specs, setSpecs] = useState<SpecRow[]>([{ key: '', value: '' }]);

  // Flatten categories incl. children
  const flattenCategories = (cats: Category[]): Category[] => {
    const result: Category[] = [];
    cats.forEach((c) => {
      result.push(c);
      if (c.children) result.push(...c.children);
    });
    return result;
  };

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(flattenCategories(res.data.categories || [])));

    if (isEdit) {
      api
        .get(`/products/admin/${id}`)
        .then((res) => {
          const p = res.data.product;
          setName(p.name);
          setDescription(p.description || '');
          setPrice(String(p.price));
          setDiscountPrice(p.discountPrice ? String(p.discountPrice) : '');
          setCategoryId(p.categoryId);
          setBrand(p.brand || '');
          setStockStatus(p.stockStatus);
          setIsPublished(p.isPublished);
          setIsFeatured(p.isFeatured);
          setImage(p.image || '');
          setGalleryImages(p.galleryImages || []);
          setFeatures(p.features || []);
          const specEntries = p.specifications ? Object.entries(p.specifications) : [];
          setSpecs(specEntries.length > 0 ? specEntries.map(([k, v]) => ({ key: k, value: String(v) })) : [{ key: '', value: '' }]);
        })
        .catch(() => toast.error('Failed to load product'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));

  const updateSpec = (idx: number, field: 'key' | 'value', val: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  };

  const addSpecRow = () => setSpecs((prev) => [...prev, { key: '', value: '' }]);
  const removeSpecRow = (idx: number) => setSpecs((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      toast.error('Name, price, and category are required');
      return;
    }

    const specifications: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) specifications[s.key.trim()] = s.value;
    });

    const payload = {
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      categoryId,
      brand,
      stockStatus,
      isPublished,
      isFeatured,
      image,
      galleryImages,
      features,
      specifications,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-white mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="admin-card p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="admin-input"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="admin-input resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Discount Price (₹)</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                min="0"
                step="0.01"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="admin-input"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.parentId ? `— ${c.name}` : c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Stock Status</label>
              <select
                value={stockStatus}
                onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                className="admin-input"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-navy-100 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 rounded accent-navy-700" />
              Published (visible on site)
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-100 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 rounded accent-navy-700" />
              Featured on homepage
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-white">Images</h3>
          <SingleImageUploader value={image} onChange={setImage} label="Featured Image" />
          <MultiImageUploader value={galleryImages} onChange={setGalleryImages} label="Gallery Images" />
        </div>

        {/* Features */}
        <div className="admin-card p-5 space-y-3">
          <h3 className="font-display font-semibold text-sm text-white">Features</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
              placeholder="e.g. 1TB SSD storage"
              className="flex-1 admin-input"
            />
            <button type="button" onClick={addFeature} className="px-4 rounded-xl bg-navy-900/60 text-navy-100 font-semibold text-sm hover:bg-white/10">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {features.length > 0 && (
            <ul className="space-y-1.5">
              {features.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 bg-surface border border-white/5 rounded-lg px-3 py-2 text-sm text-navy-300">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="text-navy-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Specifications */}
        <div className="admin-card p-5 space-y-3">
          <h3 className="font-display font-semibold text-sm text-white">Specifications</h3>
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Storage"
                value={spec.key}
                onChange={(e) => updateSpec(i, 'key', e.target.value)}
                className="flex-1 admin-input"
              />
              <input
                type="text"
                placeholder="e.g. 1TB"
                value={spec.value}
                onChange={(e) => updateSpec(i, 'value', e.target.value)}
                className="flex-1 admin-input"
              />
              <button type="button" onClick={() => removeSpecRow(i)} className="px-3 rounded-xl text-navy-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button type="button" onClick={addSpecRow} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-300 hover:text-white">
            <Plus className="w-4 h-4" /> Add Specification
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-xl bg-navy-900/60 text-navy-100 font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;

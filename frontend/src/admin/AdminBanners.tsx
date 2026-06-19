import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Banner, BannerLocation } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { SingleImageUploader } from './ImageUploader';

const LOCATIONS: { value: BannerLocation; label: string }[] = [
  { value: 'AFTER_HERO', label: 'After First Page (Hero)' },
  { value: 'AFTER_PRODUCTS', label: 'After Products Section' },
];

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [location, setLocation] = useState<BannerLocation>('AFTER_HERO');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  const fetchBanners = () => {
    setLoading(true);
    api
      .get('/banners/admin/all')
      .then((res) => setBanners(res.data.banners || []))
      .catch(() => toast.error('Failed to load banners'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setImage('');
    setCtaText('');
    setCtaLink('');
    setLocation('AFTER_HERO');
    setDisplayOrder('0');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setTitle(b.title || '');
    setSubtitle(b.subtitle || '');
    setImage(b.image);
    setCtaText(b.ctaText || '');
    setCtaLink(b.ctaLink || '');
    setLocation(b.location);
    setDisplayOrder(String(b.displayOrder));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload an image');
      return;
    }
    setSaving(true);
    try {
      const payload = { title, subtitle, image, ctaText, ctaLink, location, displayOrder: parseInt(displayOrder) || 0 };
      if (editing) {
        await api.put(`/banners/${editing.id}`, payload);
        toast.success('Banner updated');
      } else {
        await api.post('/banners', payload);
        toast.success('Banner created');
      }
      resetForm();
      fetchBanners();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      fetchBanners();
    } catch {
      toast.error('Failed to delete banner');
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await api.put(`/banners/${b.id}`, { isActive: !b.isActive });
      fetchBanners();
    } catch {
      toast.error('Failed to update banner');
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Banners</h1>
          <p className="text-sm text-navy-300">{banners.length} total banners</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card p-5 mb-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-white">{editing ? 'Edit Banner' : 'New Banner'}</h3>
            <button type="button" onClick={resetForm} className="text-navy-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <SingleImageUploader value={image} onChange={setImage} label="Banner Image *" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Subtitle</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as BannerLocation)}
                className="admin-input"
              >
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">CTA Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Shop Now"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">CTA Link URL</label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/products"
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Display Order</label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Banner' : 'Create Banner'}
          </button>
        </form>
      )}

      <div className="admin-card overflow-hidden divide-y divide-white/5">
        {banners.map((b) => (
          <div key={b.id} className="p-4 flex items-center gap-3">
            <div className="w-20 h-12 rounded-lg bg-surface overflow-hidden shrink-0">
              <img src={b.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm">{b.title || '(No title)'}</p>
              <p className="text-xs text-navy-400">{LOCATIONS.find((l) => l.value === b.location)?.label} · order {b.displayOrder}</p>
            </div>
            <button
              onClick={() => toggleActive(b)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                b.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-white/5 text-navy-400 border border-white/10'
              }`}
            >
              {b.isActive ? 'Active' : 'Hidden'}
            </button>
            <button onClick={() => openEdit(b)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-navy-300 shrink-0">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-red-500 shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {banners.length === 0 && <div className="text-center py-12 text-navy-400 text-sm">No banners yet.</div>}
      </div>
    </div>
  );
};

export default AdminBanners;

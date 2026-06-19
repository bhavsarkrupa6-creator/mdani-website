import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Testimonial } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { SingleImageUploader } from './ImageUploader';

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  const fetchTestimonials = () => {
    setLoading(true);
    api
      .get('/testimonials/admin/all')
      .then((res) => setTestimonials(res.data.testimonials || []))
      .catch(() => toast.error('Failed to load testimonials'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const resetForm = () => {
    setName('');
    setMessage('');
    setRating(5);
    setImage('');
    setOrder('0');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setName(t.name);
    setMessage(t.message);
    setRating(t.rating);
    setImage(t.image || '');
    setOrder(String(t.order));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error('Name and message are required');
      return;
    }
    setSaving(true);
    try {
      const payload = { name, message, rating, image, order: parseInt(order) || 0 };
      if (editing) {
        await api.put(`/testimonials/${editing.id}`, payload);
        toast.success('Testimonial updated');
      } else {
        await api.post('/testimonials', payload);
        toast.success('Testimonial created');
      }
      resetForm();
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch {
      toast.error('Failed to delete testimonial');
    }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      await api.put(`/testimonials/${t.id}`, { isActive: !t.isActive });
      fetchTestimonials();
    } catch {
      toast.error('Failed to update testimonial');
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Testimonials</h1>
          <p className="text-sm text-navy-300">{testimonials.length} total testimonials</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card p-5 mb-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
            <button type="button" onClick={resetForm} className="text-navy-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Customer Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Rating</label>
              <div className="flex items-center gap-1 pt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-navy-300 text-navy-300' : 'text-white/10'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              className="admin-input resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <SingleImageUploader value={image} onChange={setImage} label="Customer Photo (optional)" />
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Testimonial' : 'Create Testimonial'}
          </button>
        </form>
      )}

      <div className="admin-card overflow-hidden divide-y divide-white/5">
        {testimonials.map((t) => (
          <div key={t.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface overflow-hidden shrink-0 flex items-center justify-center font-display font-bold text-navy-300 text-sm">
              {t.image ? <img src={t.image} alt="" className="w-full h-full object-cover" /> : t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white text-sm">{t.name}</p>
              <p className="text-xs text-navy-400 line-clamp-1">{t.message}</p>
            </div>
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-navy-300 text-navy-300' : 'text-white/10'}`} />
              ))}
            </div>
            <button
              onClick={() => toggleActive(t)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                t.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-white/5 text-navy-400 border border-white/10'
              }`}
            >
              {t.isActive ? 'Active' : 'Hidden'}
            </button>
            <button onClick={() => openEdit(t)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-navy-300 shrink-0">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => handleDelete(t.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-red-500 shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {testimonials.length === 0 && <div className="text-center py-12 text-navy-400 text-sm">No testimonials yet.</div>}
      </div>
    </div>
  );
};

export default AdminTestimonials;

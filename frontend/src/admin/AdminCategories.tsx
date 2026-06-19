import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { SingleImageUploader } from './ImageUploader';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [parentId, setParentId] = useState('');
  const [order, setOrder] = useState('0');
  const [saving, setSaving] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const fetchCategories = () => {
    setLoading(true);
    api
      .get('/categories/admin/all')
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage('');
    setParentId('');
    setOrder('0');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setParentId(cat.parentId || '');
    setOrder(String(cat.order));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = { name, description, image, parentId: parentId || null, order: parseInt(order) || 0 };
      if (editing) {
        await api.put(`/categories/${editing.id}`, payload);
        toast.success('Category updated');
      } else {
        await api.post('/categories', payload);
        toast.success('Category created');
      }
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await api.put(`/categories/${cat.id}`, { isActive: !cat.isActive });
      fetchCategories();
    } catch {
      toast.error('Failed to update category');
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  const parentOptions = categories.filter((c) => !c.parentId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Categories</h1>
          <p className="text-sm text-navy-300">{categories.length} total categories</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card p-5 mb-6 space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-white">{editing ? 'Edit Category' : 'New Category'}</h3>
            <button type="button" onClick={resetForm} className="text-navy-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Parent Category</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="admin-input"
              >
                <option value="">None (top-level)</option>
                {parentOptions
                  .filter((c) => c.id !== editing?.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="admin-input resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <SingleImageUploader value={image} onChange={setImage} label="Category Image" />
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
            {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      )}

      <div className="admin-card overflow-hidden">
        <div className="divide-y divide-white/5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              draggable
              onDragStart={() => handleDragStart(cat.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(cat.id)}
              className={`p-4 flex items-center gap-3 cursor-move transition-colors ${
                draggedId === cat.id ? 'bg-navy-900/50 opacity-50' : 'hover:bg-white/5'
              }`}
            >
              <GripVertical className="w-4 h-4 text-navy-500 shrink-0" />
              <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden shrink-0">
                {cat.image && <img src={cat.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">
                  {cat.parentId && <span className="text-navy-400">— </span>}
                  {cat.name}
                </p>
                <p className="text-xs text-navy-400">{cat._count?.products ?? 0} products · order {cat.order}</p>
              </div>
              <button
                onClick={() => toggleActive(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                  cat.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/15' : 'bg-white/5 text-navy-400 border border-white/10'
                }`}
              >
                {cat.isActive ? 'Active' : 'Hidden'}
              </button>
              <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-navy-300 shrink-0">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 text-red-500 shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {categories.length === 0 && <div className="text-center py-12 text-navy-400 text-sm">No categories yet.</div>}
      </div>
    </div>
  );
};

export default AdminCategories;

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = categories.findIndex(c => c.id === draggedId);
    const targetIndex = categories.findIndex(c => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCategories = [...categories];
    const [draggedCat] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedCat);

    setCategories(newCategories);
    setDraggedId(null);

    try {
      const categoryOrders = newCategories.map((cat, idx) => ({
        id: cat.id,
        order: idx,
      }));
      await api.put('/categories/order', { categoryOrders });
      toast.success('Categories reordered');
    } catch (err: any) {
      toast.error('Failed to reorder categories');
      fetchCategories();
    }
  };

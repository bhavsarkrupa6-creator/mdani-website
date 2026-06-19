import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { SiteContent } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSiteData } from '../context/SiteDataContext';

const AdminContent: React.FC = () => {
  const { refresh } = useSiteData();
  const [content, setContent] = useState<Partial<SiteContent>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/site/content')
      .then((res) => setContent(res.data.content || {}))
      .catch(() => toast.error('Failed to load content'))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof SiteContent, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/site/content', content);
      await refresh();
      toast.success('Content saved successfully');
    } catch {
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Site Content</h1>
          <p className="text-sm text-navy-300">Edit homepage text, about us and footer content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-5">
        {/* Hero Section */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-white border-b border-white/10 pb-3">
            Hero Section
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Hero Title</label>
            <input
              type="text"
              value={content.heroTitle || ''}
              onChange={(e) => update('heroTitle', e.target.value)}
              className="admin-input"
              placeholder="e.g. Level Up Your Game"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Hero Subtitle</label>
            <textarea
              value={content.heroSubtitle || ''}
              onChange={(e) => update('heroSubtitle', e.target.value)}
              rows={2}
              className="admin-input resize-none"
              placeholder="Short tagline below the hero title"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">CTA Button Text</label>
            <input
              type="text"
              value={content.heroCtaText || ''}
              onChange={(e) => update('heroCtaText', e.target.value)}
              className="admin-input"
              placeholder="e.g. Shop Now"
            />
          </div>
        </div>

        {/* About Us */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-white border-b border-white/10 pb-3">
            About Us Page
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">About Us Content</label>
            <textarea
              value={content.aboutUsContent || ''}
              onChange={(e) => update('aboutUsContent', e.target.value)}
              rows={5}
              className="admin-input resize-none"
              placeholder="Describe your store, its history, and what makes it special..."
            />
          </div>
        </div>

        {/* Homepage Content */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-white border-b border-white/10 pb-3">
            Homepage Additional Content
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Homepage Content</label>
            <textarea
              value={content.homepageContent || ''}
              onChange={(e) => update('homepageContent', e.target.value)}
              rows={4}
              className="admin-input resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="admin-card p-5 space-y-4">
          <h3 className="font-display font-semibold text-sm text-white border-b border-white/10 pb-3">
            Footer
          </h3>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Footer Tagline</label>
            <input
              type="text"
              value={content.footerContent || ''}
              onChange={(e) => update('footerContent', e.target.value)}
              className="admin-input"
              placeholder="e.g. © Mdani Games. All rights reserved."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminContent;

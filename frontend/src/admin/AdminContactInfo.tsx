import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { ContactInfo } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSiteData } from '../context/SiteDataContext';

const AdminContactInfo: React.FC = () => {
  const { refresh } = useSiteData();
  const [info, setInfo] = useState<Partial<ContactInfo>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/site/contact-info')
      .then((res) => setInfo(res.data.contactInfo || {}))
      .catch(() => toast.error('Failed to load contact info'))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: keyof ContactInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/site/contact-info', info);
      await refresh();
      toast.success('Contact info saved');
    } catch {
      toast.error('Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  const fields: { key: keyof ContactInfo; label: string; placeholder: string; type?: string }[] = [
    { key: 'phone', label: 'Phone Number', placeholder: '+91 00000 00000', type: 'tel' },
    { key: 'whatsapp', label: 'WhatsApp Number', placeholder: '+91 00000 00000 (include country code)', type: 'tel' },
    { key: 'email', label: 'Email Address', placeholder: 'info@mdanigames.example', type: 'email' },
    { key: 'address', label: 'Store Address', placeholder: 'Your full store address' },
    { key: 'googleMapsUrl', label: 'Google Maps Embed URL', placeholder: 'https://maps.google.com/embed?...' },
  ];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Contact Info</h1>
          <p className="text-sm text-navy-300">Update your store's contact details</p>
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

      <div className="admin-card p-5 sm:p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              value={(info[field.key] as string) || ''}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="admin-input"
            />
          </div>
        ))}

        <div className="text-xs text-navy-400 bg-surface border border-white/5 rounded-xl p-3">
          <strong>WhatsApp tip:</strong> Enter the number with country code and no spaces or dashes, e.g. <code>919876543210</code>. This is used for the WhatsApp chat links on the site.
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Contact Info'}
        </button>
      </div>
    </div>
  );
};

export default AdminContactInfo;

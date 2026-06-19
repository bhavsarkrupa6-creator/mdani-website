import React, { useState } from 'react';
import { Wrench, Upload, X, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { ContactMethod } from '../types';
import SectionHeading from '../components/SectionHeading';

const DEVICE_TYPES = ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'Nintendo Switch', 'Controller', 'Other'];

const RepairRequestPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    deviceType: '',
    brand: '',
    model: '',
    problemDescription: '',
    preferredContact: 'PHONE' as ContactMethod,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputCls = "w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-navy-300/40";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));
      const res = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const urls = res.data.files.map((f: { url: string }) => f.url);
      setImages((prev) => [...prev, ...urls]);
    } catch {
      toast.error('Image upload requires admin login. You can describe the issue without images.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.deviceType || !form.problemDescription) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/repair-requests', { ...form, images });
      setSubmitted(true);
      toast.success('Repair request submitted successfully!');
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-navy-900/60 border border-white/8 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-navy-300" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white mb-2">Request Received</h1>
        <p className="text-navy-300 text-sm mb-6">
          Thanks, {form.name}! We've received your repair request and will reach out to you via {form.preferredContact.toLowerCase()} shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: '', phone: '', email: '', deviceType: '', brand: '', model: '', problemDescription: '', preferredContact: 'PHONE' });
            setImages([]);
          }}
          className="px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center">
          <Wrench className="w-6 h-6 text-navy-300" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">Repair Services</h1>
          <p className="text-sm text-navy-300">PS5, PS4, Xbox, controllers, HDMI ports & more</p>
        </div>
      </div>

      <p className="text-sm text-navy-400 mb-8 max-w-2xl">
        Fill out the form below with details about your device and the issue you're experiencing. Our technicians
        will review your request and contact you with a quote and timeline.
      </p>

      <form onSubmit={handleSubmit} className="bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 sm:p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Phone *</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Device Type *</label>
            <select
              required
              value={form.deviceType}
              onChange={(e) => setForm({ ...form, deviceType: e.target.value })}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="">Select device</option>
              {DEVICE_TYPES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Model</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Problem Description *</label>
          <textarea
            required
            rows={4}
            value={form.problemDescription}
            onChange={(e) => setForm({ ...form, problemDescription: e.target.value })}
            placeholder="Describe the issue in detail..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Upload Images (optional)</label>
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl py-6 cursor-pointer hover:bg-white/5 hover:border-navy-300/30 transition-colors">
            <Upload className="w-5 h-5 text-navy-400" />
            <span className="text-sm text-navy-300">{uploading ? 'Uploading...' : 'Click to upload photos of the issue'}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
          {images.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-navy-950/80 flex items-center justify-center"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Preferred Contact Method</label>
          <div className="flex gap-2">
            {(['PHONE', 'EMAIL', 'WHATSAPP'] as ContactMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setForm({ ...form, preferredContact: method })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  form.preferredContact === method
                    ? 'bg-navy-300 text-navy-950 border-transparent'
                    : 'bg-surface border-white/10 text-navy-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {method.charAt(0) + method.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-navy-300 text-navy-950 font-bold py-3.5 text-sm hover:bg-white transition-colors disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit Repair Request'}
        </button>
      </form>
    </div>
  );
};

export default RepairRequestPage;

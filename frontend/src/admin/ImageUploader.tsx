import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

interface SingleImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export const SingleImageUploader: React.FC<SingleImageUploaderProps> = ({ value, onChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || 'Image upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">{label}</label>
      {value ? (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-navy-950/70 flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
          {uploading ? <Loader2 className="w-5 h-5 text-navy-400 animate-spin" /> : <Upload className="w-5 h-5 text-navy-400" />}
          <span className="text-xs text-navy-400">{uploading ? 'Uploading' : 'Upload'}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      )}
    </div>
  );
};

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({ value, onChange, label = 'Gallery Images' }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('images', f));
      const res = await api.post('/upload/multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const urls = res.data.files.map((f: { url: string }) => f.url);
      onChange([...value, ...urls]);
    } catch (err: any) {
      console.error('Upload error:', err);
      const msg = err.response?.data?.message || 'Image upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2">
        {value.map((img, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-navy-950/70 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center gap-1 w-24 h-24 rounded-xl border-2 border-dashed border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
          {uploading ? <Loader2 className="w-5 h-5 text-navy-400 animate-spin" /> : <Upload className="w-5 h-5 text-navy-400" />}
          <span className="text-xs text-navy-400">{uploading ? 'Uploading' : 'Add'}</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useSiteData } from '../context/SiteDataContext';
import SectionHeading from '../components/SectionHeading';
import { buildWhatsAppLink } from '../utils/helpers';

const Contact: React.FC = () => {
  const { contactInfo } = useSiteData();
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/site/messages', form);
      setSubmitted(true);
      toast.success('Message sent successfully!');
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-xl bg-surface border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:border-navy-300/40";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SectionHeading eyebrow="We're Here to Help" title="Contact Us" subtitle="Reach out with questions about products, orders, or repairs — we usually respond within a few hours." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info cards */}
        <div className="lg:col-span-1 space-y-4">
          {contactInfo?.phone && (
            <a href={`tel:${contactInfo.phone}`} className="flex items-start gap-3 bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 card-glow transition-all">
              <div className="w-11 h-11 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-navy-300" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-0.5">Phone</h3>
                <p className="text-sm text-navy-300">{contactInfo.phone}</p>
              </div>
            </a>
          )}
          {contactInfo?.whatsapp && (
            <a
              href={buildWhatsAppLink(contactInfo.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 card-glow transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-0.5">WhatsApp</h3>
                <p className="text-sm text-navy-300">{contactInfo.whatsapp}</p>
              </div>
            </a>
          )}
          {contactInfo?.email && (
            <a href={`mailto:${contactInfo.email}`} className="flex items-start gap-3 bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 card-glow transition-all">
              <div className="w-11 h-11 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-navy-300" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-0.5">Email</h3>
                <p className="text-sm text-navy-300 break-all">{contactInfo.email}</p>
              </div>
            </a>
          )}
          {contactInfo?.address && (
            <div className="flex items-start gap-3 bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5">
              <div className="w-11 h-11 rounded-xl bg-navy-900/60 border border-white/8 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-navy-300" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white mb-0.5">Address</h3>
                <p className="text-sm text-navy-300">{contactInfo.address}</p>
                {contactInfo.googleMapsUrl && (
                  <a href={contactInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-navy-300 underline mt-1 inline-block hover:text-white transition-colors">
                    View on Map
                  </a>
                )}
              </div>
            </div>
          )}

          {contactInfo?.googleMapsUrl && (
            <div className="rounded-2xl overflow-hidden border border-[rgba(123,189,232,0.07)] aspect-video">
              <iframe
                src={contactInfo.googleMapsUrl}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store location map"
              />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-navy-900/60 border border-white/8 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-navy-300" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Message Sent</h3>
              <p className="text-navy-300 text-sm mb-5">Thanks for reaching out! We'll get back to you soon.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', phone: '', email: '', message: '' });
                }}
                className="px-5 py-2.5 rounded-xl bg-navy-300 text-navy-950 font-semibold text-sm hover:bg-white transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-[rgba(123,189,232,0.07)] rounded-2xl p-5 sm:p-8 space-y-4">
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
                  <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Phone</label>
                  <input
                    type="tel"
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-navy-400 mb-1.5">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 rounded-xl bg-navy-300 text-navy-950 font-bold py-3.5 text-sm hover:bg-white transition-colors disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

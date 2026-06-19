import React, { useEffect, useState } from 'react';
import { Wrench, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { RepairRequest, RepairStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_OPTIONS: { value: RepairStatus; label: string; color: string }[] = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/15' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-purple-500/10 text-purple-400 border border-purple-500/15' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-500/10 text-green-400 border border-green-500/15' },
];

const getStatusStyle = (status: RepairStatus) =>
  STATUS_OPTIONS.find((s) => s.value === status)?.color || 'bg-navy-900/60 text-navy-300 border border-white/8';

const AdminRepairRequests: React.FC = () => {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<RepairStatus | ''>('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (filterStatus) params.status = filterStatus;
    api
      .get('/repair-requests/admin/all', { params })
      .then((res) => setRequests(res.data.repairRequests || []))
      .catch(() => toast.error('Failed to load repair requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const updateStatus = async (id: string, status: RepairStatus) => {
    try {
      await api.patch(`/repair-requests/${id}/status`, { status });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this repair request?')) return;
    try {
      await api.delete(`/repair-requests/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success('Request deleted');
    } catch {
      toast.error('Failed to delete request');
    }
  };

  if (loading) return <LoadingSpinner full size="lg" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Repair Requests</h1>
          <p className="text-sm text-navy-300">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as RepairStatus | '')}
          className="admin-input sm:w-auto cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="admin-card overflow-hidden">
            <div
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-navy-900/60 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5 text-navy-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{r.name} — {r.deviceType} {r.brand && `(${r.brand})`}</p>
                <p className="text-xs text-navy-400 line-clamp-1">{r.problemDescription}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${getStatusStyle(r.status)}`}>
                {STATUS_OPTIONS.find((s) => s.value === r.status)?.label}
              </span>
              <ChevronDown className={`w-4 h-4 text-navy-400 shrink-0 transition-transform ${expanded === r.id ? 'rotate-180' : ''}`} />
            </div>

            {expanded === r.id && (
              <div className="border-t border-white/10 px-4 pb-4 pt-3 space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-navy-400 mb-0.5">Contact Info</p>
                    <p className="text-white">{r.phone}</p>
                    <p className="text-white">{r.email}</p>
                    <p className="text-xs text-navy-400 mt-0.5">Preferred: {r.preferredContact.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400 mb-0.5">Device</p>
                    <p className="text-white">{r.deviceType} {r.brand} {r.model}</p>
                    <p className="text-xs text-navy-400 mt-0.5">Submitted {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-navy-400 mb-0.5">Problem Description</p>
                  <p className="text-sm text-white leading-relaxed">{r.problemDescription}</p>
                </div>

                {r.images && r.images.length > 0 && (
                  <div>
                    <p className="text-xs text-navy-400 mb-1.5">Attached Images</p>
                    <div className="flex gap-2 flex-wrap">
                      {r.images.map((img, i) => (
                        <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                          <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-white/10 hover:opacity-80 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <p className="text-xs font-bold text-navy-400 uppercase tracking-wide">Update Status:</p>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => updateStatus(r.id, s.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border ${
                        r.status === s.value
                          ? 'bg-navy-300 text-navy-950 border-transparent'
                          : 'bg-surface border-white/10 text-navy-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="admin-card text-center py-14 text-navy-400 text-sm">
            No repair requests found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRepairRequests;

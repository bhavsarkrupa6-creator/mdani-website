import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Wrench,
  Mail,
  AlertCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import api from '../utils/api';
import { DashboardStats, Product, RepairRequest, ContactMessage } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/helpers';

interface RecentActivity {
  products: Product[];
  repairRequests: RepairRequest[];
  messages: ContactMessage[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => {
        setStats(res.data.stats);
        setActivity(res.data.recentActivity);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner full size="lg" />;

  const statCards = [
    { label: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, to: '/admin/products' },
    { label: 'Categories', value: stats?.totalCategories ?? 0, icon: FolderTree, to: '/admin/categories' },
    { label: 'Pending Repairs', value: stats?.pendingRepairs ?? 0, icon: Wrench, to: '/admin/repair-requests' },
    { label: 'Unread Messages', value: stats?.unreadMessages ?? 0, icon: Mail, to: '/admin/messages' },
    { label: 'Out of Stock', value: stats?.outOfStockCount ?? 0, icon: AlertCircle, to: '/admin/products' },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-white mb-1">Dashboard</h1>
      <p className="text-sm text-navy-300 mb-6">Overview of your store activity</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="admin-card p-4 sm:p-5 flex flex-col gap-2 card-glow transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-navy-900/60 flex items-center justify-center">
              <card.icon className="w-5 h-5 text-navy-100" />
            </div>
            <span className="font-display font-bold text-2xl text-white">{card.value}</span>
            <span className="text-xs text-navy-300">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Products */}
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">Recent Products</h3>
            <Link to="/admin/products" className="text-xs font-semibold text-navy-300 hover:text-white inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity?.products.length ? activity.products.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface overflow-hidden shrink-0">
                  {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-navy-400">{formatPrice(p.price)}</p>
                </div>
              </div>
            )) : <p className="text-sm text-navy-400">No products yet</p>}
          </div>
        </div>

        {/* Recent Repair Requests */}
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">Recent Repair Requests</h3>
            <Link to="/admin/repair-requests" className="text-xs font-semibold text-navy-300 hover:text-white inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity?.repairRequests.length ? activity.repairRequests.map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-900/60 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-navy-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{r.name} — {r.deviceType}</p>
                  <p className="text-xs text-navy-400 line-clamp-1">{r.problemDescription}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-navy-900/60 text-navy-300 shrink-0">{r.status}</span>
              </div>
            )) : <p className="text-sm text-navy-400">No repair requests yet</p>}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-white">Recent Messages</h3>
            <Link to="/admin/messages" className="text-xs font-semibold text-navy-300 hover:text-white inline-flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity?.messages.length ? activity.messages.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy-900/60 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-navy-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.name}</p>
                  <p className="text-xs text-navy-400 line-clamp-1">{m.message}</p>
                </div>
                {!m.isRead && <span className="w-2 h-2 rounded-full bg-navy-300 mt-1.5 shrink-0" />}
              </div>
            )) : <p className="text-sm text-navy-400">No messages yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

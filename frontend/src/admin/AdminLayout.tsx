import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  MessageSquareQuote,
  Wrench,
  Mail,
  FileText,
  Phone,
  Settings,
  LogOut,
  Menu,
  X,
  Gamepad2,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Categories', to: '/admin/categories', icon: FolderTree },
  { label: 'Banners', to: '/admin/banners', icon: ImageIcon },
  { label: 'Testimonials', to: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Repair Requests', to: '/admin/repair-requests', icon: Wrench },
  { label: 'Messages', to: '/admin/messages', icon: Mail },
  { label: 'Site Content', to: '/admin/content', icon: FileText },
  { label: 'Contact Info', to: '/admin/contact-info', icon: Phone },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
];

const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <>
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/8 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-900 to-navy-500 flex items-center justify-center shadow-glow-sm">
          <Gamepad2 className="w-5 h-5 text-white" strokeWidth={2} />
        </div>
        <div className="leading-tight">
          <p className="font-display font-bold text-white text-sm">Mdani Admin</p>
          <p className="text-[10px] text-navy-400 -mt-0.5">Control Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-navy-300/15 text-navy-300' : 'text-navy-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/8 space-y-1 shrink-0">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-navy-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="w-[18px] h-[18px] shrink-0" />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-navy-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          Logout
        </button>
        {admin && <p className="px-3.5 pt-2 text-[11px] text-navy-500">Signed in as {admin.username}</p>}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f2035] border-r border-white/8 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — opens from the right, matching the hamburger position */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-72 bg-[#0f2035] border-l border-white/8 flex flex-col shadow-[-4px_0_40px_rgba(0,0,0,0.5)] animate-slide-in-right">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-0 right-0 m-3 w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-[#0f2035] border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-900 to-navy-500 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">Mdani Admin</span>
          </div>
          <button onClick={() => setMobileOpen(true)} className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white hover:bg-white/5 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

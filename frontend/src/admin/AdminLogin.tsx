import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Gamepad2, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(username, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 relative overflow-hidden">
      <div
        className="absolute -left-32 -top-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: '#7BBDE8' }}
      />
      <div
        className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full opacity-15 blur-3xl"
        style={{ background: '#4E8EA2' }}
      />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-navy-300/15 flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="w-7 h-7 text-navy-300" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">Admin Panel</h1>
          <p className="text-sm text-navy-300">Mdani Games & Sales Service</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-dark rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-300 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-navy-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full rounded-xl bg-white/10 border border-white/15 pl-10 pr-4 py-3 text-sm text-white placeholder:text-navy-300/60 focus:outline-none focus:ring-2 focus:ring-navy-300"
                placeholder="Enter username"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-navy-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-navy-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded-xl bg-white/10 border border-white/15 pl-10 pr-10 py-3 text-sm text-white placeholder:text-navy-300/60 focus:outline-none focus:ring-2 focus:ring-navy-300"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-navy-300 text-navy-950 font-bold py-3 text-sm hover:bg-white transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
const NotFound: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-28 text-center">
    <div className="w-16 h-16 rounded-2xl bg-navy-900/60 border border-white/8 flex items-center justify-center mx-auto mb-5">
      <Gamepad2 className="w-8 h-8 text-navy-300" />
    </div>
    <h1 className="font-display font-extrabold text-5xl text-white mb-2">404</h1>
    <p className="text-navy-400 mb-7">This page took a wrong turn. Let's get you back.</p>
    <Link to="/" className="inline-flex px-6 py-3 rounded-xl bg-navy-300 text-navy-950 font-bold text-sm hover:bg-white transition-colors">
      Back to Home
    </Link>
  </div>
);
export default NotFound;

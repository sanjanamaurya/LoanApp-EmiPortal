import React from 'react';
import { Shield, Lock, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Instant Verification</h4>
              <p className="text-xs text-slate-500">Real-time eligibility calculation</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">256-bit Bank Grade Security</h4>
              <p className="text-xs text-slate-500">Encrypted data protection</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Transparent Terms</h4>
              <p className="text-xs text-slate-500">Zero hidden fees or surprise charges</p>
            </div>
          </div>
        </div>

        {/* Links & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Access Assist</span>
            <span>•</span>
            <span>Loan Application & EMI Management Portal</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-slate-800 transition-colors">
              Calculator
            </Link>
            <Link to="/apply" className="hover:text-slate-800 transition-colors">
              Apply
            </Link>
            <Link to="/dashboard" className="hover:text-slate-800 transition-colors">
              Tracker
            </Link>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for Technical Evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

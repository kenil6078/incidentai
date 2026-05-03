import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export default function PublicNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === 'super_admin' ? "/admin" : "/dashboard";
  };

  const isPricing = location.pathname === "/pricing";

  return (
    <nav className="border-b-2 border-black bg-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="landing-brand">
          <div className="w-8 h-8 bg-black border-2 border-black neo-shadow flex items-center justify-center">
            <span className="text-[#FF6B6B] font-black text-xs uppercase italic">i</span>
          </div>
          <span className="text-lg font-black tracking-tight text-black uppercase italic">incident.ai</span>
        </Link>
        <div className="flex items-center gap-8">
          <Link 
            to="/pricing" 
            className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
              isPricing ? "text-[#FF6B6B]" : "text-black hover:text-[#FF6B6B]"
            }`}
          >
            Pricing
          </Link>
          {user ? (
            <Link 
              to={getDashboardLink()} 
              className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 border-2 border-black neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-black px-3 py-1.5 hover:bg-[#FDE68A] transition border-2 border-transparent hover:border-black">Sign in</Link>
              <Link
                to="/register"
                className="bg-[#FF6B6B] text-black text-sm font-bold px-6 py-2 border-2 border-black neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

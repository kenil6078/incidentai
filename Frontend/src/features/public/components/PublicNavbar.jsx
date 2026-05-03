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
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="landing-brand">
          <div className="w-8 h-8 bg-black border-2 border-black neo-shadow flex items-center justify-center shrink-0">
            <span className="text-[#FF6B6B] font-black text-xs uppercase italic">i</span>
          </div>
          <span className="text-sm md:text-lg font-black tracking-tight text-black uppercase italic whitespace-nowrap">incident.ai</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-8 overflow-hidden">
          <Link 
            to="/pricing" 
            className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap ${
              isPricing ? "text-[#FF6B6B]" : "text-black hover:text-[#FF6B6B]"
            }`}
          >
            Pricing
          </Link>
          {user ? (
            <Link 
              to={getDashboardLink()} 
              className="bg-black text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 md:px-6 md:py-2 border-2 border-black neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-xs md:text-sm font-bold text-black px-2 py-1 md:px-3 md:py-1.5 hover:bg-[#FDE68A] transition border-2 border-transparent hover:border-black whitespace-nowrap">Sign in</Link>
              <Link
                to="/register"
                className="bg-[#FF6B6B] text-black text-xs md:text-sm font-bold px-3 py-1.5 md:px-6 md:py-2 border-2 border-black neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all whitespace-nowrap"
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

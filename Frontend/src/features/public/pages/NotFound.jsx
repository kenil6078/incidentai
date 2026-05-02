import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, AlertCircle } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import AppShell from "../../../components/AppShell";
import { SocketProvider } from "../../../context/SocketContext";

const NotFoundContent = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        {/* Main Error Box */}
        <div className="w-24 h-24 bg-[#FF6B6B] border-4 border-black neo-shadow flex items-center justify-center text-black rotate-3 transition-transform hover:rotate-0 duration-300">
          <AlertCircle className="w-12 h-12 stroke-[3]" />
        </div>
        
        {/* 404 Badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FDE68A] border-4 border-black neo-shadow flex items-center justify-center text-black -rotate-6 font-black text-sm">
          404
        </div>

        {/* Decorative dots */}
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-black border-2 border-white rounded-full"></div>
      </div>
      
      <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-black mb-4 uppercase italic">
        Page Not Found
      </h1>
      
      <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-zinc-500 mb-10 bg-zinc-100 px-4 py-1.5 border-2 border-black neo-shadow-sm">
        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Error: Page_Not_Found
      </div>

      <p className="max-w-md text-base md:text-lg text-zinc-700 mb-12 font-bold leading-tight">
        The Page you're looking for doesn't exist in our system. <br className="hidden md:block" />
        It might have been moved, deleted, or never existed.
      </p>

      <div className="flex flex-col sm:flex-row gap-5">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center justify-center gap-3 px-10 py-4 bg-white border-4 border-black neo-shadow text-sm font-black text-black hover:bg-zinc-50 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3] group-hover:-translate-x-1 transition-transform" /> 
          GO BACK
        </button>
        <Link
          to="/dashboard"
          className="group flex items-center justify-center gap-3 px-10 py-4 bg-[#D4F4E4] border-4 border-black neo-shadow text-sm font-black text-black hover:bg-[#bcecd4] transition-all active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          <Home className="w-5 h-5 stroke-[3] group-hover:scale-110 transition-transform" /> 
          DASHBOARD
        </Link>
      </div>

      {/* Footer Branding */}
      <div className="mt-24 flex flex-col items-center gap-4 opacity-50">
        <div className="w-32 h-1 bg-black"></div>
        <p className="text-[10px] font-mono text-black uppercase tracking-[0.6em] font-bold">
          incident.ai // Opps ! We Lost The Page
        </p>
      </div>
    </div>
  );
};

export default function NotFound() {
  const { user, isInitialized } = useAuth();

  // If user is logged in, show inside AppShell to maintain navigation context
  if (isInitialized && user) {
    return (
      <SocketProvider>
        <AppShell>
          <div className="grid-bg min-h-full overflow-hidden">
            <NotFoundContent />
          </div>
        </AppShell>
      </SocketProvider>
    );
  }

  // Otherwise show standalone centered layout
  return (
    <div className="min-h-screen bg-[#FAFAFA] grid-bg flex flex-col overflow-hidden">
      <NotFoundContent />
    </div>
  );
}

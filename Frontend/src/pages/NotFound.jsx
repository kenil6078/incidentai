import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-zinc-950 flex items-center justify-center text-white font-black text-4xl mb-8 animate-in">
        ?
      </div>
      
      <h1 className="text-6xl font-black tracking-tighter text-zinc-950 mb-4 animate-in" style={{ animationDelay: "100ms" }}>
        404
      </h1>
      
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-8 animate-in" style={{ animationDelay: "200ms" }}>
        Resource not found
      </div>

      <p className="max-w-xs text-sm text-zinc-600 mb-12 animate-in" style={{ animationDelay: "300ms" }}>
        The page you are looking for doesn't exist or has been moved to another coordinate.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 animate-in" style={{ animationDelay: "400ms" }}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 border border-zinc-200 bg-white text-sm font-semibold text-zinc-950 hover:bg-zinc-50 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 transition"
        >
          <Home className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      <div className="mt-24 pt-12 border-t border-zinc-200 w-full max-w-sm">
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
          incident.ai / error_handler
        </p>
      </div>
    </div>
  );
}

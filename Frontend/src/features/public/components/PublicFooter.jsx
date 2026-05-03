import React from "react";
import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="border-t-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 text-sm font-black text-black flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-8">
          <span>© 2026 incident.ai</span>
          <Link to="/pricing" className="hover:underline decoration-2">Pricing</Link>
          <Link to="/status/demo" className="hover:underline decoration-2">Demo Status</Link>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-[#D4F4E4] border-2 border-black flex items-center justify-center font-black text-[10px]">ai</div>
           <span>built for SRE teams who care</span>
        </div>
      </div>
    </footer>
  );
}

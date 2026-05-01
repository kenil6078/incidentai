import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from 'axios';
import { useAuth } from "../../auth/hook/useAuth";
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { formatRelative, SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from "../../../components/Badges";

export default function PublicStatus() {
  const { orgSlug } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/public/status/${orgSlug}`).then((r) => setData(r.data)).catch(() => {});
  }, [orgSlug]);

  if (!data) return <div className="min-h-screen flex items-center justify-center font-mono text-xs text-zinc-500">Connecting to status page...</div>;

  const isAllOk = data.services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8 md:space-y-12">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-950 flex items-center justify-center text-white font-black text-xl italic">i</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-950">{data.org_name}</h1>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Status Page</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {user && (
              <Link to="/dashboard" className="text-[10px] font-bold text-zinc-950 hover:underline flex items-center gap-1 uppercase tracking-wider mb-2">
                <ArrowLeft className="w-3 h-3" /> Back to Workspace
              </Link>
            )}
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-400 uppercase mb-1">Last Updated</div>
              <div className="text-xs font-bold text-zinc-950">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        <div className={`p-6 border flex items-center gap-4 ${isAllOk ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
          {isAllOk ? <CheckCircle2 className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-amber-600" />}
          <div>
            <h2 className="text-lg font-bold tracking-tight">{isAllOk ? "All Systems Operational" : "Partial System Degraded"}</h2>
            <p className="text-sm opacity-80">{isAllOk ? "Everything is running smoothly." : "We are investigating issues with some services."}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Current Service Status</div>
          <div className="divide-y divide-zinc-100 border border-zinc-100">
            {data.services.map((s) => (
              <div key={s.id || s._id} className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-zinc-900">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                    {SERVICE_STATUS_LABELS[s.status] || s.status}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${SERVICE_STATUS_COLORS[s.status] || 'bg-zinc-300'} ${s.status !== 'operational' ? 'pulse-dot' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.active_incidents.length > 0 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400">Active Incidents</div>
            <div className="space-y-4">
              {data.active_incidents.map((inc) => (
                <div key={inc.id || inc._id} className="border border-zinc-200 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-zinc-950">{inc.title}</h3>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{formatRelative(inc.created_at || inc.createdAt)}</span>
                  </div>
                  <div className="text-sm text-zinc-600 leading-relaxed">{inc.description}</div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="px-2 py-0.5 bg-zinc-950 text-white text-[10px] font-mono uppercase font-bold tracking-widest">{inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="pt-12 border-t border-zinc-100 text-center">
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Powered by <span className="text-zinc-950 font-bold">incident.ai</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

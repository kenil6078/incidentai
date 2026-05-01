import React, { useEffect, useState } from "react";
import api from 'axios';
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, AlertCircle, Clock, ArrowLeft } from "lucide-react";

const Card = ({ title, value, sub, icon: Icon }) => (
  <div className="bg-white border border-zinc-200 p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{title}</div>
      <Icon className="w-4 h-4 text-zinc-400" />
    </div>
    <div className="text-3xl font-black tracking-tighter text-zinc-950">{value}</div>
    <div className="text-xs text-zinc-500 mt-1">{sub}</div>
  </div>
);

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/analytics/summary")
      .then((r) => setData(r.data))
      .catch((err) => {
        console.error("Analytics load failed", err);
        setData({
          total_incidents: 0,
          critical_count: 0,
          mttr_minutes: 0,
          availability: 100,
          by_severity: {},
          by_service: []
        });
      });
  }, []);

  if (!data) return <div className="p-10 text-sm text-zinc-500">Loading analytics...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="analytics-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/analytics</div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950">Insights</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card title="MTTR" value={`${data.mttr_minutes || 0}m`} sub="Mean time to resolve" icon={Clock} />
        <Card title="Incident Volume" value={data.total_incidents || 0} sub="Last 30 days" icon={BarChart3} />
        <Card title="Availability" value={`${data.availability || 100}%`} sub="Across all services" icon={TrendingUp} />
        <Card title="Critical Hits" value={data.critical_count || 0} sub="Requires attention" icon={AlertCircle} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-200 p-6">
          <div className="text-sm font-bold mb-6">Incidents by Severity</div>
          <div className="space-y-4">
            {Object.entries(data.by_severity || {}).map(([sev, count]) => (
              <div key={sev}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-mono uppercase tracking-wider">{sev}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="h-2 bg-zinc-100 overflow-hidden">
                  <div 
                    className={`h-full ${sev === 'Critical' ? 'bg-red-500' : sev === 'High' ? 'bg-orange-500' : 'bg-zinc-950'}`} 
                    style={{ width: `${(count / data.total_incidents) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-6">
          <div className="text-sm font-bold mb-6">Service Reliability</div>
          <div className="space-y-4">
            {(data.by_service || []).map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-zinc-50 last:border-0">
                <span className="text-sm font-medium">{s.name}</span>
                <span className="text-xs font-mono text-green-600 font-bold">{s.uptime}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

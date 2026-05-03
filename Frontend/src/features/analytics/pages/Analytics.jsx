import React, { useEffect, useState, useCallback } from "react";
import { getSummary } from "../services/analytics.api";
import { useNavigate } from "react-router-dom";
import { BarChart3, TrendingUp, AlertCircle, Clock, RefreshCw, Activity } from "lucide-react";
import { useSocket } from "../../../context/SocketContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Card = ({ title, value, sub, icon: Icon, color = "bg-white" }) => (
  <div className={`${color} border-2 border-black p-5 neo-shadow transition-transform hover:-translate-y-1 h-full flex flex-col justify-between`}>
    <div className="flex items-center justify-between mb-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 font-bold">{title}</div>
      <Icon className="w-4 h-4 text-zinc-900" strokeWidth={3} />
    </div>
    <div className="text-4xl font-black tracking-tighter text-zinc-950 uppercase italic">{value}</div>
    <div className="text-[10px] font-bold text-zinc-500 uppercase mt-1 tracking-tight">{sub}</div>
  </div>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-black p-2 neo-shadow-sm z-50">
        <p className="text-[10px] font-black uppercase tracking-wider">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const navigate = useNavigate();
  const { subscribe, connected } = useSocket();
  const [data, setData] = useState({
    total_incidents: 0,
    critical_count: 0,
    mttr_minutes: 0,
    availability: 100,
    by_severity: { Critical: 0, High: 0, Medium: 0, Low: 0 },
    by_service: []
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const summary = await getSummary();
      setData(summary);
    } catch (err) {
      console.error("Analytics load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const unsub = subscribe((evt) => {
      if (evt.eventName?.startsWith('incident.') || evt.eventName?.startsWith('service.')) {
        fetchData();
      }
    });
    return () => unsub && unsub();
  }, [subscribe, fetchData]);

  if (loading) return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[400px] gap-4">
      <RefreshCw className="w-8 h-8 animate-spin text-zinc-950" />
      <div className="text-xs font-black uppercase tracking-widest text-zinc-500">Synchronizing Intelligence...</div>
    </div>
  );

  const severityData = Object.entries(data?.by_severity || { Critical: 0, High: 0, Medium: 0, Low: 0 }).map(([name, value]) => ({
    name,
    value: value || 0,
    color: name === 'Critical' ? '#EF4444' : name === 'High' ? '#F97316' : name === 'Medium' ? '#EAB308' : '#18181B'
  })).reverse();

  const serviceData = (data?.by_service || []).length > 0 
    ? (data.by_service).map(s => ({
        name: s.name,
        value: s.uptime || 0,
        status: s.status || 'unknown'
      }))
    : [{ name: 'No Services', value: 100, status: 'unknown' }];

  const totalIncidents = data?.total_incidents ?? 0;
  const availability = data?.availability ?? 100;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 uppercase italic leading-none">
            Analytics
          </h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
            Real-time system performance & reliability metrics
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 border-2 border-black bg-zinc-50 text-[10px] font-mono font-bold uppercase tracking-wider neo-shadow-sm">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'} pulse-dot`} />
          {connected ? 'Live Sync Active' : 'Disconnected'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="MTTR" value={`${data?.mttr_minutes || 0}m`} sub="Mean time to resolve" icon={Clock} color="bg-[#D4F4E4]" />
        <Card title="Incident Volume" value={totalIncidents} sub="Last 30 days" icon={BarChart3} color="bg-[#FDE68A]" />
        <Card title="Availability" value={`${availability}%`} sub="Across all services" icon={TrendingUp} color="bg-[#FFB5E8]" />
        <Card title="Critical Hits" value={data?.critical_count || 0} sub="Requires attention" icon={AlertCircle} color="bg-[#FF6B6B]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Incidents by Severity */}
        <div className="bg-white border-2 border-black p-6 neo-shadow flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Incidents by Severity
            </h3>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">TOTAL: {totalIncidents}</div>
          </div>
          
          <div className="flex-1 w-full relative min-h-[200px]">
            {totalIncidents === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/50 border border-dashed border-zinc-200 z-10">
                <BarChart3 className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No Incident Data</p>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical" margin={{ left: 40, right: 20, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide domain={[0, 'dataMax + 1']} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#18181B' }}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafafa' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32} stroke="#000" strokeWidth={2}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Reliability */}
        <div className="bg-white border-2 border-black p-6 neo-shadow flex flex-col min-h-[350px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Service Reliability
            </h3>
            <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">HEALTH: {availability}%</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-6">
            <div className="h-full relative min-h-[200px]">
              {(data?.by_service || []).length === 0 && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/50 border border-dashed border-zinc-200 z-10">
                  <Activity className="w-8 h-8 text-zinc-300 mb-2" />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No Service Data</p>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={2}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.status === 'operational' ? '#22C55E' : entry.status === 'degraded' ? '#EAB308' : entry.status === 'outage' ? '#EF4444' : '#E4E4E7'} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center gap-3 pr-4 h-full">
              {(data?.by_service || []).length > 0 ? (
                <>
                  {serviceData.slice(0, 5).map((s) => (
                    <div key={s.name} className="flex items-center justify-between border-b border-zinc-100 pb-1 last:border-0">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`w-2 h-2 rounded-none border border-black ${s.status === 'operational' ? 'bg-green-500' : s.status === 'degraded' ? 'bg-yellow-500' : s.status === 'outage' ? 'bg-red-500' : 'bg-zinc-200'}`} />
                        <span className="text-[10px] font-black uppercase truncate">{s.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold">{s.value}%</span>
                    </div>
                  ))}
                  {serviceData.length > 5 && (
                    <div className="text-[10px] text-zinc-400 font-bold uppercase text-center mt-2 border-t border-black pt-1">
                      + {serviceData.length - 5} more services
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4 bg-zinc-50 border border-black/5">
                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter italic">Infrastructure Offline</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

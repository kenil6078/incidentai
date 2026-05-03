import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { useAuth } from "../../auth/hooks/useAuth";
import { useAnalytics } from "../hooks/useAnalytics";
import { useIncident } from "../../incident/hooks/useIncident";
import { SeverityBadge, StatusPill } from "../../../components/Badges";
import { formatRelative } from "../../../components/Badges";
import { Activity, AlertTriangle, CheckCircle2, Timer, Plus, ArrowRight } from "lucide-react";
import { DashboardSkeleton } from "../../../components/ui/skeleton";

const Stat = ({ label, value, suffix, icon: Icon, accent = "text-zinc-950", testid }) => (
  <div className="bg-white border border-zinc-200 p-5" data-testid={testid}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400" strokeWidth={1.5} />}
    </div>
    <div className={`text-3xl font-black tracking-tighter tabular-nums ${accent}`}>
      {value}
      {suffix && <span className="text-base font-normal text-zinc-500 ml-1">{suffix}</span>}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { subscribe } = useSocket();
  const { overview, getOverview, loading: analyticsLoading } = useAnalytics();
  const { list: incidents, getIncidents, loading: incidentsLoading } = useIncident();
  const loading = analyticsLoading || incidentsLoading;

  const loadData = () => {
    getOverview();
    getIncidents();
  };

  useEffect(() => {
    loadData();
    const unsub = subscribe?.((evt) => {
      if (evt.type?.startsWith("incident.")) loadData();
    });
    return () => unsub && unsub();
  }, [subscribe]);

  const active = incidents.filter((i) => i.status !== "Resolved");
  const recent = incidents.slice(0, 8);

  if (loading && !overview) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase italic">
            Dashboard
          </h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
            Greetings, {user?.name?.split(" ")[0]}. Overview of <span className="font-mono">{user?.org_name}</span>.
          </p>
        </div>
        <Link to="/incidents/new" className="bg-[#FF6B6B] text-black border-2 border-black text-[10px] md:text-sm font-black px-4 py-2 hover:translate-y-0.5 neo-shadow transition-all flex items-center gap-2 uppercase tracking-widest" data-testid="dashboard-new-incident">
          <Plus className="w-4 h-4" strokeWidth={3} /> <span className="hidden sm:inline">New Incident</span><span className="sm:hidden">New</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Active" value={overview?.active ?? 0} icon={AlertTriangle} accent={overview?.active ? "text-red-700" : "text-zinc-950"} testid="stat-active" />
        <Stat label="Total" value={overview?.total ?? 0} icon={Activity} testid="stat-total" />
        <Stat label="Resolved" value={overview?.resolved ?? 0} icon={CheckCircle2} testid="stat-resolved" />
        <Stat label="MTTR" value={overview?.mttr_minutes ?? 0} suffix="min" icon={Timer} testid="stat-mttr" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-zinc-200">
          <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-zinc-950">Active incidents</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">requires attention</div>
            </div>
            <Link to="/incidents" className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1" data-testid="dashboard-view-all-incidents">
              All incidents <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-200">
            {active.length === 0 ? (
              <div className="p-10 text-center" data-testid="dashboard-no-active">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-3" strokeWidth={1.5} />
                <div className="text-sm font-semibold text-zinc-950">All systems operational</div>
                <div className="text-xs text-zinc-500 mt-1">No active incidents right now.</div>
              </div>
            ) : (
              active.map((i) => (
                <Link
                  key={i.id || i._id}
                  to={`/incidents/${i.id || i._id}`}
                  className="block px-5 py-3 hover:bg-zinc-50 transition"
                  data-testid={`dashboard-incident-${i.id || i._id}`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <SeverityBadge severity={i.severity} />
                    <StatusPill status={i.status} />
                    <span className="text-[10px] font-mono text-zinc-500 ml-auto">{formatRelative(i.created_at || i.createdAt)}</span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-950">{i.title}</div>
                  {i.description && <div className="text-xs text-zinc-600 mt-0.5 truncate">{i.description}</div>}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-zinc-200">
          <div className="px-5 py-3 border-b border-zinc-200">
            <div className="text-sm font-bold text-zinc-950">Recent</div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">last 8 incidents</div>
          </div>
          <div className="divide-y divide-zinc-200">
            {recent.length === 0 && (
              <div className="p-6 text-center text-xs text-zinc-500">No incidents yet.</div>
            )}
            {recent.map((i) => (
              <Link key={i.id || i._id} to={`/incidents/${i.id || i._id}`} className="block px-5 py-2.5 hover:bg-zinc-50">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={i.severity} withDot={false} />
                  <span className="text-xs font-medium text-zinc-950 truncate flex-1">{i.title}</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  {i.status} · {formatRelative(i.created_at || i.createdAt)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

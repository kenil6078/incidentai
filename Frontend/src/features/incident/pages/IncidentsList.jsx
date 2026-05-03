import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { useIncident } from "../hooks/useIncident";
import { SeverityBadge, StatusPill } from "../../../components/Badges";
import { formatRelative } from "../../../components/Badges";
import { Plus, Search, ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { IncidentRowSkeleton } from "../../../components/ui/skeleton";

import { useAuth } from "../../auth/hooks/useAuth";

export default function IncidentsList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe } = useSocket();
  const { list: incidents, loading, getIncidents } = useIncident();

  const [statusF, setStatusF] = useState("All statuses");
  const [sevF, setSevF] = useState("All severities");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(timer);
  }, [q]);

  const load = () => {
    const params = {};
    if (statusF !== "All statuses") params.status = statusF;
    if (sevF !== "All severities") params.severity = sevF;
    getIncidents(params);
  };

  useEffect(() => {
    load();
  }, [statusF, sevF]);

  useEffect(() => {
    const unsub = subscribe?.((evt) => {
      if (evt.type?.startsWith("incident.")) load();
    });
    return () => unsub && unsub();
  }, [subscribe]);

  const visible = incidents.filter(
    (i) =>
      !debouncedQ ||
      i.title?.toLowerCase().includes(debouncedQ.toLowerCase()) ||
      i.description?.toLowerCase().includes(debouncedQ.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase italic">
            Incidents
          </h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
            Manage and respond to system disruptions.
          </p>
        </div>
        {user?.role === "admin" && (
          <Link
            to="/incidents/new"
            className="bg-[#FF6B6B] text-black border-2 border-black text-sm font-black px-4 py-2 hover:translate-y-0.5 neo-shadow transition-all flex items-center gap-2 uppercase tracking-widest"
            data-testid="incidents-new-button"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Incident
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-white border border-zinc-200 p-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-zinc-200 focus:outline-none focus:border-zinc-950"
            placeholder="Search incidents..."
            data-testid="incidents-search"
          />
        </div>
        <Select value={statusF} onValueChange={setStatusF}>
          <SelectTrigger
            className="w-44 rounded-none"
            data-testid="incidents-filter-status"
          >
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="All statuses">All statuses</SelectItem>
            <SelectItem value="Investigating">Investigating</SelectItem>
            <SelectItem value="Identified">Identified</SelectItem>
            <SelectItem value="Monitoring">Monitoring</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sevF} onValueChange={setSevF}>
          <SelectTrigger
            className="w-44 rounded-none"
            data-testid="incidents-filter-severity"
          >
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            <SelectItem value="All severities">All severities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-zinc-200">
        <div className="grid grid-cols-12 px-5 py-2 border-b border-zinc-200 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          <div className="col-span-10 md:col-span-6">Incident</div>
          <div className="hidden md:block md:col-span-2">Severity</div>
          <div className="hidden md:block md:col-span-2">Status</div>
          <div className="col-span-2 text-right">Created</div>
        </div>
        <div className="divide-y divide-zinc-200" data-testid="incidents-table">
          {loading ? (
            <>
              <IncidentRowSkeleton />
              <IncidentRowSkeleton />
              <IncidentRowSkeleton />
              <IncidentRowSkeleton />
              <IncidentRowSkeleton />
            </>
          ) : visible.length === 0 ? (
            <div
              className="p-10 text-center text-sm text-zinc-500"
              data-testid="incidents-empty"
            >
              No incidents match your filters.
            </div>
          ) : (
            visible.map((i) => (
              <Link
                key={i.id || i._id}
                to={`/incidents/${i.id || i._id}`}
                className="grid grid-cols-12 px-5 py-3 hover:bg-zinc-50 transition items-center"
                data-testid={`incident-row-${i.id || i._id}`}
              >
                <div className="col-span-10 md:col-span-6 min-w-0">
                  <div className="text-sm font-semibold text-zinc-950 truncate">
                    {i.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 md:mt-0">
                    <div className="text-[10px] font-mono text-zinc-500 truncate">
                      {i.creator?.name || i.created_by_name || "Unknown"}
                    </div>
                    <div className="md:hidden flex gap-1">
                      <span className="scale-75 origin-left">
                        <SeverityBadge severity={i.severity} withDot={false} />
                      </span>
                      <span className="scale-75 origin-left">
                        <StatusPill status={i.status} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:col-span-2">
                  <SeverityBadge severity={i.severity} />
                </div>
                <div className="hidden md:block md:col-span-2">
                  <StatusPill status={i.status} />
                </div>
                <div className="col-span-2 text-right text-[10px] font-mono text-zinc-500">
                  {formatRelative(i.created_at || i.createdAt)}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/SocketContext";
import { useAuth } from "../../auth/hook/useAuth";
import { useIncident } from "../hooks/useIncident";
import { useTimeline } from "../../timeline/hooks/useTimeline";
import { useAI } from "../../ai/hooks/useAI";
import { useTeam } from "../../team/hooks/useTeam";
import { useServices } from "../../services/hooks/useServices";
import { SeverityBadge, StatusPill } from "../../../components/Badges";
import { formatRelative, formatAbsolute, STATUS_DOT } from "../../../components/Badges";
import { toast } from "sonner";
import { ArrowLeft, Send, Sparkles, FileText, Search as SearchIcon, Trash2, Copy, Check, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { IncidentDetailSkeleton } from "../../../components/ui/skeleton";
import ReactMarkdown from "react-markdown";

const TYPE_LABEL = {
  update: "UPDATE", alert: "ALERT", fix: "FIX",
  status_change: "STATUS", ai: "AI", system: "SYSTEM",
};

const TYPE_COLOR = {
  update: "text-zinc-700",
  alert: "text-red-700",
  fix: "text-green-700",
  status_change: "text-blue-700",
  ai: "text-indigo-700",
  system: "text-zinc-500",
};

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe } = useSocket();
  
  const { current: incident, getIncident, updateIncident, deleteIncident } = useIncident();
  const { entries: timeline, getTimeline, addEntry } = useTimeline(id);
  const { members: team, getTeam } = useTeam();
  const { list: services, getServices } = useServices();
  const { loadingKey, generateSummary, generateRootCause, generatePostmortem, summary, rootCause, postmortem } = useAI(id);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("update");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiOutput, setAiOutput] = useState({ kind: null, text: "" });
  const [copying, setCopying] = useState(false);

  const canEdit = user?.role !== "viewer";
  const canDelete = user?.role === "admin" || user?.role === "super_admin";

  const loadData = useCallback(() => {
    if (!id) return;
    getIncident(id);
    getTimeline();
    getTeam();
    getServices();
  }, [id, getIncident, getTimeline, getTeam, getServices]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const unsub = subscribe?.((evt) => {
      if (evt.type === "incident.updated" && (evt.id === id || evt._id === id)) getIncident(id);
      if (evt.type === "timeline.added" && (evt.incidentId === id || evt._id === id)) getTimeline();
      if (evt.type === "incident.deleted" && (evt.incident_id === id || evt.id === id)) {
        toast("Incident was deleted");
        navigate("/incidents");
      }
    });
    return () => unsub && unsub();
  }, [subscribe, id, navigate, getIncident, getTimeline]);

  const onUpdateStatus = async (status) => {
    try {
      await updateIncident(id, { status: status.toLowerCase() });
      toast.success(`Status → ${status}`);
    } catch (e) { toast.error("Failed to update status"); }
  };

  const onUpdateSeverity = async (severity) => {
    try {
      await updateIncident(id, { severity: severity.toLowerCase() });
      toast.success(`Severity → ${severity}`);
    } catch (e) { toast.error("Failed to update severity"); }
  };

  const onAddTimeline = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    try {
      await addEntry({ message: msg, type: msgType });
      setMsg("");
    } catch (e) { toast.error("Failed to post update"); }
  };

  const runAI = async (kind) => {
    try {
      let result;
      if (kind === "summary") result = await generateSummary();
      if (kind === "root-cause") result = await generateRootCause();
      if (kind === "postmortem") result = await generatePostmortem();
      
      const text = result.payload[kind === 'root-cause' ? 'rootCause' : kind];
      setAiOutput({ kind, text });
      setShowAiModal(true);
      toast.success(`AI ${kind} generated`);
    } catch (e) {
      toast.error(`AI ${kind} failed`);
    }
  };

  const copyAiOutput = () => {
    navigator.clipboard.writeText(aiOutput.text);
    setCopying(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopying(false), 2000);
  };

  const onAddToTimelineFromAI = async () => {
    try {
      await addEntry({ 
        message: aiOutput.text, 
        type: "ai",
        createdBy: { name: "AI Assistant" }
      });
      toast.success("Added to timeline");
      setShowAiModal(false);
    } catch (e) {
      toast.error("Failed to add to timeline");
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Delete this incident permanently?")) return;
    try {
      await deleteIncident(id);
      toast.success("Incident deleted");
      navigate("/incidents");
    } catch (e) { 
      toast.error("Delete failed"); 
    }
  };

  if (!incident) return <IncidentDetailSkeleton />;

  const assignedNames = (incident.assignedTo || []).map((u) => u.name || (typeof u === 'string' ? team.find(t => (t.id || t._id) === u)?.name : null)).filter(Boolean);
  const serviceNames = (incident.affectedServices || []).map((s) => s.name || (typeof s === 'string' ? services.find(sv => (sv.id || sv._id) === s)?.name : null)).filter(Boolean);

  return (
    <div className="p-6 space-y-5 max-w-7xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="detail-back">
        <ArrowLeft className="w-3.5 h-3.5" /> All incidents
      </button>

      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-1">incident · {(incident?.id || incident?._id)?.toString().slice(-8)}</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 break-words" data-testid="incident-title">{incident.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <SeverityBadge severity={incident.severity} />
            <StatusPill status={incident.status} />
            <span className="text-[10px] font-mono text-zinc-500">opened by {incident.creator?.name || (typeof incident.creator === 'string' ? incident.creator : 'System')} · {formatRelative(incident.createdAt)}</span>
          </div>
        </div>
        {canDelete && (
          <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900 px-3 py-1.5 border border-red-200 hover:bg-red-50 w-full md:w-auto justify-center" data-testid="incident-delete">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {incident.description && (
            <div className="bg-white border border-zinc-200 p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Description</div>
              <div className="text-sm text-zinc-800 whitespace-pre-wrap">{incident.description}</div>
            </div>
          )}

          <div className="bg-white border border-zinc-200">
            <div className="px-5 py-3 border-b border-zinc-200 flex items-center justify-between">
              <div className="text-sm font-bold">Timeline</div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{timeline.length} events</span>
            </div>
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto" data-testid="timeline-list">
              {timeline.length === 0 && (
                <div className="text-sm text-zinc-500">No events yet.</div>
              )}
              {timeline.map((ev, idx) => (
                <div key={ev.id || idx} className="border-l-2 border-zinc-200 pl-4 relative" data-testid={`timeline-event-${ev.id || idx}`}>
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${ev.type === "ai" ? "bg-indigo-500" : ev.type === "fix" ? "bg-green-500" : ev.type === "alert" ? "bg-red-500" : "bg-zinc-400"}`} />
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${TYPE_COLOR[ev.type] || "text-zinc-700"}`}>{TYPE_LABEL[ev.type] || "UPDATE"}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{ev.createdBy?.name || ev.user || 'System'}</span>
                    <span className="text-[10px] font-mono text-zinc-400 ml-auto">{formatAbsolute(ev.timestamp || ev.createdAt)}</span>
                  </div>
                  <div className="text-sm text-zinc-800 whitespace-pre-wrap">{ev.message || ev.action}</div>
                </div>
              ))}
            </div>

            {canEdit && (
              <form onSubmit={onAddTimeline} className="border-t border-zinc-200 p-4 flex gap-2 items-stretch" data-testid="timeline-form">
                <Select value={msgType} onValueChange={setMsgType}>
                  <SelectTrigger className="w-32 rounded-none" data-testid="timeline-type-select"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="fix">Fix</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Post a status update..."
                  className="flex-1 px-3 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                  data-testid="timeline-input"
                />
                <button type="submit" className="bg-zinc-950 text-white px-4 hover:bg-zinc-800 flex items-center gap-1.5 text-sm font-semibold" data-testid="timeline-submit">
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-zinc-200 p-5 space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Severity</div>
              <Select value={incident.severity} onValueChange={onUpdateSeverity} disabled={!canEdit}>
                <SelectTrigger className="rounded-none" data-testid="detail-severity-select"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Status</div>
              <Select value={incident.status} onValueChange={onUpdateStatus} disabled={!canEdit}>
                <SelectTrigger className="rounded-none" data-testid="detail-status-select"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Assigned</div>
              <div className="text-sm text-zinc-800">{assignedNames.length ? assignedNames.join(", ") : <span className="text-zinc-400">Unassigned</span>}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Affected services</div>
              <div className="text-sm text-zinc-800">{serviceNames.length ? serviceNames.join(", ") : <span className="text-zinc-400">None</span>}</div>
            </div>

            {incident.resolvedAt && (
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Resolved</div>
                <div className="text-sm text-zinc-800">{formatAbsolute(incident.resolvedAt)}</div>
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200 relative overflow-hidden" data-testid="ai-panel">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 ai-panel-border" />
            {loadingKey && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center animate-in">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin mb-4" />
                <div className="text-sm font-bold text-zinc-950">AI is thinking...</div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">Analyzing logs & metrics</div>
              </div>
            )}

            <div className="px-5 py-3 border-b border-zinc-200 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-sm font-bold text-zinc-950">AI Assistant</span>
              <span className="text-[10px] font-mono text-zinc-500 ml-auto">gemini-1.5-flash</span>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => runAI("summary")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition group"
                data-testid="ai-summary-btn"
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600" />
                <span className="font-medium">Generate summary</span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400">brief</span>
              </button>
              <button
                onClick={() => runAI("root-cause")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition group"
                data-testid="ai-rootcause-btn"
              >
                <SearchIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600" />
                <span className="font-medium">Suggest root cause</span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400">analysis</span>
              </button>
              <button
                onClick={() => runAI("postmortem")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2 border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition group"
                data-testid="ai-postmortem-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600" />
                <span className="font-medium">Write postmortem</span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400">report</span>
              </button>
            </div>
          </div>

          <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
            <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden">
              <div className="shimmer-bg h-1 w-full" />
              <div className="p-6">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">AI {aiOutput.kind} Result</span>
                  </div>
                  <DialogTitle className="text-2xl tracking-tighter capitalize">{aiOutput.kind?.replace('-', ' ')}</DialogTitle>
                </DialogHeader>

                <div className="mt-6 ai-modal-content prose">
                  <ReactMarkdown>{aiOutput.text}</ReactMarkdown>
                </div>

                <DialogFooter className="mt-8 pt-6 border-t border-zinc-100">
                  <button
                    onClick={copyAiOutput}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 border border-zinc-200 hover:bg-zinc-50 transition"
                  >
                    {copying ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copying ? "Copied" : "Copy to clipboard"}
                  </button>
                  <button
                    onClick={onAddToTimelineFromAI}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-zinc-950 text-white hover:bg-zinc-800 transition"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Add to Timeline
                  </button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

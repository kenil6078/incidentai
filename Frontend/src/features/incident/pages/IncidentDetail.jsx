import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSocket } from "../../../context/SocketContext";
import { pushTimelineEntry } from "../../timeline/timeline.slice";
import { useAuth } from "../../auth/hooks/useAuth";
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
import { IncidentDetailSkeleton, Skeleton } from "../../../components/ui/skeleton";
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
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { subscribe } = useSocket();
  
  const { current: incident, getIncident, updateIncident, deleteIncident } = useIncident();
  const { entries: timeline, getTimeline, addEntry } = useTimeline(id);
  const { members: team, getTeam } = useTeam();
  const { list: services, getServices } = useServices();
  const { loadingKey, generateSummary, generateRootCause, generatePostmortem } = useAI(id);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("update");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiOutput, setAiOutput] = useState({ kind: null, text: "" });
  const [copying, setCopying] = useState(false);
  const timelineEndRef = useRef(null);

  const loadData = useCallback(() => {
    if (!id) return;
    getIncident(id);
    getTimeline();
    getTeam();
    getServices();
  }, [id, getIncident, getTimeline, getTeam, getServices]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (timelineEndRef.current) {
      timelineEndRef.current.scrollTop = timelineEndRef.current.scrollHeight;
    }
  }, [timeline, aiOutput.text]);

  useEffect(() => {
    const unsub = subscribe?.((evt) => {
      const isIncidentUpdate = evt.type === "incident.updated" || evt.eventName === "incident.updated";
      const isTimelineAdded = evt.type === "timeline.added" || evt.eventName === "timeline.added" || (evt.incidentId && !evt.title);
      
      if (isIncidentUpdate && (evt.id === id || evt._id === id)) getIncident(id);
      if (isTimelineAdded && (evt.incidentId === id)) getTimeline();
      
      if (evt.type === "incident.deleted" && (evt.incident_id === id || evt.id === id)) {
        toast("Incident was deleted");
        navigate("/incidents");
      }
    });
    return () => unsub && unsub();
  }, [subscribe, id, navigate, getIncident, getTimeline]);

  if (!incident) return <IncidentDetailSkeleton />;

  // Access Control Check
  const userId = user?.id || user?._id;
  const isAssigned = (incident.assignedTo || []).some(u => 
    (typeof u === 'string' ? u : (u.id || u._id)) === userId
  );
  const isCreator = (typeof incident.creator === 'string' ? incident.creator : (incident.creator?.id || incident.creator?._id)) === userId;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const hasAccess = isAdmin || isAssigned || isCreator;

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-950">Access Restricted</h1>
        <p className="text-sm text-zinc-500 max-w-xs">This incident is only visible to the assigned response team and administrators.</p>
        <button onClick={() => navigate("/incidents")} className="text-sm font-bold text-zinc-950 underline underline-offset-4">Return to Incidents</button>
      </div>
    );
  }

  const canEdit = isAdmin || isAssigned || isCreator;
  const canDelete = isAdmin;

  const onUpdateStatus = async (status) => {
    try {
      await updateIncident(id, { status: status.toLowerCase() });
      toast.success(`Status → ${status}`);
      getTimeline();
    } catch (e) { toast.error("Failed to update status"); }
  };

  const onUpdateSeverity = async (severity) => {
    try {
      await updateIncident(id, { severity: severity.toLowerCase() });
      toast.success(`Severity → ${severity}`);
      getTimeline();
    } catch (e) { toast.error("Failed to update severity"); }
  };

  const onAddTimeline = async (e) => {
    e.preventDefault();
    if (!msg.trim()) return;

    // Optimistic Update
    const optimisticEntry = {
      _id: Date.now().toString(),
      incidentId: id,
      message: msg,
      type: msgType,
      createdBy: { name: user.name },
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    
    // Dispatch optimistic entry immediately
    dispatch(pushTimelineEntry(optimisticEntry));
    const currentMsg = msg;
    setMsg("");

    try {
      await addEntry({ message: currentMsg, type: msgType });
      getTimeline(); // Refresh to replace optimistic with real data
    } catch (e) { 
      toast.error("Failed to post update"); 
      // In a real app, we might want to remove the optimistic entry here
    }
  };

  const runAI = async (kind) => {
    setAiOutput({ kind, text: "" });
    setShowAiModal(true);
    
    try {
      const response = await fetch(`/api/ai/${kind}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ incidentId: id })
      });

      if (!response.ok) throw new Error('AI generation failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            try {
              const data = JSON.parse(dataStr);
              if (data.chunk) {
                fullText += data.chunk;
                setAiOutput(prev => ({ ...prev, text: fullText }));
              }
              if (data.error) throw new Error(data.error);
            } catch (e) { }
          }
        }
      }
      
      getIncident(id);
    } catch (e) {
      toast.error(`AI ${kind} failed: ${e.message}`);
      setShowAiModal(false);
    }
  };

  const showSavedAI = (kind) => {
    const text = kind === "summary" ? incident.aiSummary : 
                 kind === "root-cause" ? incident.aiRootCause : 
                 incident.aiPostmortem;
    if (!text) return runAI(kind);
    setAiOutput({ kind, text });
    setShowAiModal(true);
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
        type: "ai"
      });
      toast.success("Added to timeline");
      setShowAiModal(false);
      getTimeline();
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

  const assignedNames = (incident.assignedTo || []).map((u) => u.name || (typeof u === 'string' ? team.find(t => (t.id || t._id) === u)?.name : null)).filter(Boolean);
  const serviceNames = (incident.affectedServices || []).map((s) => s.name || (typeof s === 'string' ? services.find(sv => (sv.id || sv._id) === s)?.name : null)).filter(Boolean);

  return (
    <div className="p-6 space-y-5 max-w-7xl animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950">
        <ArrowLeft className="w-3.5 h-3.5" /> All incidents
      </button>

      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-1">incident · {(incident?.id || incident?._id)?.toString().slice(-8)}</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 break-words">{incident.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-3">
            <SeverityBadge severity={incident.severity} />
            <StatusPill status={incident.status} />
            <span className="text-[10px] font-mono text-zinc-500">opened by {incident.creator?.name || (typeof incident.creator === 'string' ? incident.creator : 'System')} · {formatRelative(incident.createdAt)}</span>
          </div>
        </div>
        {canDelete && (
          <button onClick={onDelete} className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900 px-3 py-1.5 border border-red-200 hover:bg-red-50 w-full md:w-auto justify-center">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {incident.description && (
            <div className="bg-white border-2 border-black neo-shadow p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">Description</div>
              <div className="text-sm text-zinc-800 whitespace-pre-wrap leading-relaxed">{incident.description}</div>
            </div>
          )}

          <div className="bg-white border-2 border-black neo-shadow">
            <div className="px-5 py-3 border-b-2 border-black flex items-center justify-between bg-zinc-50">
              <div className="text-sm font-bold">Timeline</div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{timeline.length} events</span>
            </div>
            <div 
              ref={timelineEndRef}
              className="p-5 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar"
            >
              {timeline.length === 0 && (
                <div className="text-sm text-zinc-500">No events yet.</div>
              )}
              {timeline.map((ev, idx) => (
                <div key={ev.id || ev._id || idx} className={`border-l-2 border-black pl-4 relative transition-all duration-300 ${ev.isOptimistic ? 'opacity-50' : 'opacity-100'}`}>
                  <div className={`absolute -left-[5px] top-1.5 w-2 h-2 border border-black ${ev.type === "ai" ? "bg-[#FF6B6B]" : ev.type === "fix" ? "bg-[#4ECDC4]" : ev.type === "alert" ? "bg-[#FFE66D]" : "bg-zinc-400"}`} />
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
              <form onSubmit={onAddTimeline} className="border-t-2 border-black p-4 flex gap-2 items-stretch bg-white">
                <Select value={msgType} onValueChange={setMsgType}>
                  <SelectTrigger className="w-32 rounded-none border-2 border-black font-bold text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black">
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                    <SelectItem value="fix">Fix</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Post a status update..."
                  className="flex-1 px-3 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm font-semibold"
                />
                <button type="submit" className="bg-zinc-950 text-white px-4 hover:bg-zinc-800 border-2 border-black neo-shadow flex items-center gap-1.5 text-sm font-bold transition-all active:translate-x-1 active:translate-y-1 active:neo-shadow-none">
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border-2 border-black neo-shadow p-5 space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Severity</div>
              <Select value={incident.severity} onValueChange={onUpdateSeverity} disabled={!canEdit || incident.status === 'resolved'}>
                <SelectTrigger className="rounded-none border-2 border-black font-bold disabled:bg-zinc-50 disabled:cursor-not-allowed"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none border-2 border-black">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Status</div>
              <Select value={incident.status} onValueChange={onUpdateStatus} disabled={!canEdit || incident.status === 'resolved'}>
                <SelectTrigger className="rounded-none border-2 border-black font-bold disabled:bg-zinc-50 disabled:cursor-not-allowed"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-none border-2 border-black">
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              {incident.status === 'resolved' && (
                <div className="mt-2 text-[10px] font-bold text-green-600 uppercase tracking-tighter">Incident is locked</div>
              )}
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Assigned</div>
              <div className="text-sm font-bold text-zinc-950">{assignedNames.length ? assignedNames.join(", ") : <span className="text-zinc-400 font-normal">Unassigned</span>}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">Affected services</div>
              <div className="text-sm font-bold text-zinc-950">{serviceNames.length ? serviceNames.join(", ") : <span className="text-zinc-400 font-normal">None</span>}</div>
            </div>
          </div>

          <div className="bg-white border-2 border-black neo-shadow relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B6B]" />
            {loadingKey && (
              <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-none border-4 border-black border-t-[#FF6B6B] animate-spin mb-4" />
                <div className="text-sm font-black text-zinc-950">AI is thinking...</div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">Analyzing incident context</div>
              </div>
            )}

            <div className="px-5 py-3 border-b-2 border-black flex items-center gap-2 bg-[#D4F4E4]">
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="text-sm font-bold text-zinc-950">AI Assistant</span>
              <span className="text-[10px] font-mono text-zinc-700 ml-auto bg-white/50 px-1">1.5-flash</span>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => showSavedAI("summary")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2.5 border-2 border-black bg-white hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition-all neo-shadow-sm hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
              >
                <FileText className={`w-3.5 h-3.5 ${incident.aiSummary ? 'text-[#FF6B6B]' : 'text-zinc-400'}`} />
                <span className="font-bold">{incident.aiSummary ? "View summary" : "Generate summary"}</span>
                {incident.aiSummary && <Check className="w-3.5 h-3.5 text-green-600 ml-auto" />}
              </button>
              <button
                onClick={() => showSavedAI("root-cause")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2.5 border-2 border-black bg-white hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition-all neo-shadow-sm hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
              >
                <SearchIcon className={`w-3.5 h-3.5 ${incident.aiRootCause ? 'text-[#FF6B6B]' : 'text-zinc-400'}`} />
                <span className="font-bold">{incident.aiRootCause ? "View root cause" : "Suggest root cause"}</span>
                {incident.aiRootCause && <Check className="w-3.5 h-3.5 text-green-600 ml-auto" />}
              </button>
              <button
                onClick={() => showSavedAI("postmortem")}
                disabled={loadingKey !== null}
                className="w-full text-left px-3 py-2.5 border-2 border-black bg-white hover:bg-zinc-50 disabled:opacity-50 flex items-center gap-2 text-sm transition-all neo-shadow-sm hover:neo-shadow active:translate-x-0.5 active:translate-y-0.5"
              >
                <Sparkles className={`w-3.5 h-3.5 ${incident.aiPostmortem ? 'text-[#FF6B6B]' : 'text-zinc-400'}`} />
                <span className="font-bold">{incident.aiPostmortem ? "View postmortem" : "Write postmortem"}</span>
                {incident.aiPostmortem && <Check className="w-3.5 h-3.5 text-green-600 ml-auto" />}
              </button>
            </div>
          </div>
          <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
            <DialogContent className="max-w-2xl rounded-none p-0 border-4 border-black neo-shadow-lg overflow-hidden bg-white">
              <div className="bg-[#FF6B6B] h-2 w-full border-b-2 border-black" />
              <div className="p-8">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-[#FF6B6B]" />
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-zinc-500">AI {aiOutput.kind} Response</span>
                  </div>
                  <DialogTitle className="text-3xl font-black tracking-tighter capitalize text-black">
                    {aiOutput.kind?.replace('-', ' ')}
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-8 prose prose-zinc max-w-none prose-sm leading-relaxed overflow-y-auto overflow-x-hidden max-h-[60vh] custom-scrollbar pr-4">
                  {aiOutput.text ? (
                    <ReactMarkdown>{aiOutput.text}</ReactMarkdown>
                  ) : (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-zinc-100" />
                      <Skeleton className="h-4 w-full bg-zinc-100" />
                      <Skeleton className="h-4 w-full bg-zinc-100" />
                      <Skeleton className="h-4 w-5/6 bg-zinc-100" />
                      <div className="pt-4 space-y-2">
                        <Skeleton className="h-6 w-1/2 bg-zinc-100" />
                        <Skeleton className="h-4 w-full bg-zinc-100" />
                        <Skeleton className="h-4 w-2/3 bg-zinc-100" />
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="mt-10 pt-6 border-t-2 border-black flex items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(aiOutput.text);
                        setCopying(true);
                        setTimeout(() => setCopying(false), 2000);
                      }}
                      className="bg-white hover:bg-zinc-50 text-black px-4 py-2 border-2 border-black neo-shadow-sm flex items-center gap-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {copying ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copying ? "Copied" : "Copy results"}
                    </button>
                    <button
                      onClick={() => runAI(aiOutput.kind)}
                      disabled={loadingKey !== null}
                      className="bg-white hover:bg-zinc-50 text-black px-4 py-2 border-2 border-black neo-shadow-sm flex items-center gap-2 text-xs font-bold transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                    >
                      Regenerate
                    </button>
                  </div>
                  
                  <button
                    onClick={onAddToTimelineFromAI}
                    disabled={!aiOutput.text || loadingKey !== null}
                    className="bg-black text-white px-6 py-2 border-2 border-black neo-shadow flex items-center gap-2 text-xs font-bold transition-all hover:bg-zinc-800 active:translate-x-1 active:translate-y-1 active:neo-shadow-none disabled:opacity-50"
                  >
                    <FileText className="w-3.5 h-3.5" /> Add to Timeline
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

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from 'axios';
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function CreateIncident() {
  const navigate = useNavigate();
  const [team, setTeam] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "medium",
    status: "investigating",
    assigned_to: [],
    affected_services: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/team").catch(() => ({ data: [] })), 
      api.get("/services").catch(() => ({ data: [] }))
    ]).then(([a, b]) => {
      setTeam(a.data);
      setServices(b.data);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        severity: form.severity.toLowerCase(),
        status: form.status.toLowerCase(),
        assignedTo: form.assigned_to,
        affectedServices: form.affected_services
      };
      const r = await api.post("/incidents", payload);
      toast.success("Incident created");
      navigate(`/incidents/${r.data.id || r.data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to create incident");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key, value) => {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 mb-4" data-testid="create-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>
      <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/incidents/new</div>
      <h1 className="text-3xl font-black tracking-tighter text-zinc-950 mb-6">Declare incident</h1>

      <form onSubmit={submit} className="space-y-5 bg-white border border-zinc-200 p-6" data-testid="create-incident-form">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2.5 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
            placeholder="API gateway returning 5xx errors"
            data-testid="create-title-input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2.5 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm font-mono"
            placeholder="What's happening, what's impacted, what you've tried so far..."
            data-testid="create-description-input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Severity *</label>
            <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
              <SelectTrigger className="rounded-none" data-testid="create-severity-select"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Status *</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="rounded-none" data-testid="create-status-select"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="identified">Identified</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {team.length > 0 && (
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Assign team members</label>
            <div className="flex flex-wrap gap-2">
              {team.map((m) => (
                <button
                  type="button"
                  key={m.id || m._id}
                  onClick={() => toggle("assigned_to", m.id || m._id)}
                  className={`px-3 py-1.5 text-xs border transition ${
                    form.assigned_to.includes(m.id || m._id)
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-950"
                  }`}
                  data-testid={`assign-${m.id || m._id}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Affected services</label>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  type="button"
                  key={s.id || s._id}
                  onClick={() => toggle("affected_services", s.id || s._id)}
                  className={`px-3 py-1.5 text-xs border transition ${
                    form.affected_services.includes(s.id || s._id)
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-950"
                  }`}
                  data-testid={`service-${s.id || s._id}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-zinc-200">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-semibold border border-zinc-300 hover:bg-zinc-50" data-testid="create-cancel">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-semibold bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-50" data-testid="create-submit">
            {loading ? "Creating..." : "Declare incident"}
          </button>
        </div>
      </form>
    </div>
  );
}

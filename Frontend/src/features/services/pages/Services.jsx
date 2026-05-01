import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from 'axios';
import { toast } from "sonner";
import { Activity, Plus, ShieldCheck, ShieldAlert, MoreVertical, ArrowLeft } from "lucide-react";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from "../../../components/Badges";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", status: "operational" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const r = await api.get("/services").catch(() => ({ data: [] }));
      setServices(r.data);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const addService = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/services", form);
      toast.success("Service added");
      setForm({ name: "", description: "", status: "operational" });
      setOpen(false);
      load();
    } catch (e) {
      toast.error("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="services-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/services</div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950">Services</h1>
          <p className="text-sm text-zinc-600 mt-1">Status of your infrastructure and apps.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-zinc-950 text-white text-sm font-semibold px-4 py-2 hover:bg-zinc-800 flex items-center gap-2" data-testid="add-service-button">
              <Plus className="w-4 h-4" /> Add service
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle>Add new service</DialogTitle>
            </DialogHeader>
            <form onSubmit={addService} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm" placeholder="e.g. API Gateway" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm" placeholder="Brief description of the service" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="rounded-none"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                    <SelectItem value="outage">Outage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <button type="submit" disabled={loading} className="bg-zinc-950 text-white px-4 py-2 text-sm font-semibold w-full">
                  {loading ? "Adding..." : "Add service"}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && services.length === 0 ? (
          <>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white border border-zinc-200 p-5 space-y-4">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-zinc-100 animate-pulse" />
                  <div className="w-4 h-4 bg-zinc-100 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-1/2 bg-zinc-100 animate-pulse" />
                  <div className="h-3 w-full bg-zinc-100 animate-pulse" />
                </div>
                <div className="pt-4 border-t border-zinc-100 flex justify-between">
                  <div className="h-3 w-20 bg-zinc-100 animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-100 animate-pulse" />
                </div>
              </div>
            ))}
          </>
        ) : services.length === 0 ? (
          <div className="col-span-full py-12 text-center border border-dashed border-zinc-300">
            <Activity className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <div className="text-sm font-bold text-zinc-950">No services tracked</div>
            <div className="text-xs text-zinc-500 mt-1">Start by adding your first service or API.</div>
          </div>
        ) : (
          services.map((s) => (
            <div key={s.id || s._id} className="bg-white border border-zinc-200 p-5 hover:border-zinc-400 transition group">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 ${s.status === 'operational' ? 'bg-green-50' : 'bg-red-50'}`}>
                  {s.status === 'operational' ? <ShieldCheck className="w-5 h-5 text-green-600" /> : <ShieldAlert className="w-5 h-5 text-red-600" />}
                </div>
                <button className="text-zinc-400 hover:text-zinc-950 opacity-0 group-hover:opacity-100 transition">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="text-lg font-bold text-zinc-950 mb-1">{s.name}</div>
              <div className="text-xs text-zinc-500 mb-4 h-8 line-clamp-2">{s.description || "No description provided."}</div>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${SERVICE_STATUS_COLORS[s.status] || 'bg-zinc-300'} pulse-dot`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-700">
                    {SERVICE_STATUS_LABELS[s.status] || s.status}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">99.9% uptime</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

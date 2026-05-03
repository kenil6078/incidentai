import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ArrowLeft, Server, FileText, Activity, CheckCircle2, AlertTriangle, XCircle, Plus } from "lucide-react";
import { createService } from "../services.slice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

export default function CreateService() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: "", description: "", status: "operational" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await dispatch(createService(form)).unwrap();
      toast.success("Service created successfully");
      navigate("/services");
    } catch (err) {
      toast.error(err.detail || "Failed to create service");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <button 
        onClick={() => navigate("/services")}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-950 font-bold mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Services
      </button>

      <div className="bg-white border-3 border-black neo-shadow-lg overflow-hidden">
        <div className="bg-[#FFB5E8] p-6 border-b-3 border-black">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white border-2 border-black neo-shadow-sm">
              <Server className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-black uppercase italic">
                Add New Service
              </h1>
              <p className="text-xs font-bold text-black/60 uppercase tracking-wider">
                Register a new infrastructure component
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-950">
              <Server className="w-4 h-4" /> Service Name
            </label>
            <input 
              required 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-4 border-2 border-black focus:outline-none focus:ring-0 focus:bg-zinc-50 text-base font-bold neo-shadow-sm transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none" 
              placeholder="e.g. Production API Cluster" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-950">
              <FileText className="w-4 h-4" /> Description
            </label>
            <textarea 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-4 border-2 border-black focus:outline-none focus:ring-0 focus:bg-zinc-50 text-base font-bold h-32 neo-shadow-sm transition-all focus:translate-x-1 focus:translate-y-1 focus:shadow-none resize-none" 
              placeholder="What does this service do? Who depends on it?" 
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-950">
              <Activity className="w-4 h-4" /> Initial Health Status
            </label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger className="h-14 border-2 border-black neo-shadow-sm font-bold text-base hover:bg-zinc-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-2 border-black neo-shadow-md">
                <SelectItem value="operational" className="py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 stroke-[3]" />
                    <span className="font-black">Operational</span>
                  </div>
                </SelectItem>
                <SelectItem value="degraded" className="py-3">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 stroke-[3]" />
                    <span className="font-black">Degraded Performance</span>
                  </div>
                </SelectItem>
                <SelectItem value="outage" className="py-3">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-rose-500 stroke-[3]" />
                    <span className="font-black">Partial Outage</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={submitting} 
              className="bg-zinc-950 text-white px-8 py-5 text-lg font-black w-full neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 stroke-[3]" /> Create Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

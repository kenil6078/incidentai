import React, { useEffect, useState } from "react";
import api from 'axios';
import { toast } from "sonner";
import { useAuth } from "../../auth/hook/useAuth";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../components/ui/dialog";

export default function Team() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "developer", password: "changeme123" });
  const [tempCred, setTempCred] = useState(null);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const load = async () => {
    try {
      const r = await api.get("/team").catch(() => ({ data: [] }));
      setTeam(r.data);
    } catch (e) {}
  };

  useEffect(() => { load(); }, []);

  const invite = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/team/invite", form);
      setTempCred({ email: r.data.email, password: r.data.temp_password });
      setForm({ name: "", email: "", role: "developer", password: "changeme123" });
      load();
      toast.success("Member added");
    } catch (e) { toast.error(e?.response?.data?.detail || "Invite failed"); }
  };

  const updateRole = async (id, role) => {
    try {
      await api.put(`/team/${id}/role`, { role });
      load();
      toast.success("Role updated");
    } catch (e) { toast.error("Failed"); }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await api.delete(`/team/${id}`);
      load();
      toast.success("Removed");
    } catch (e) { toast.error("Failed"); }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="team-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/team</div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950">Team</h1>
          <p className="text-sm text-zinc-600 mt-1">{team.length} member{team.length !== 1 && "s"} in <span className="font-mono">{user?.org_name}</span></p>
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button onClick={() => setOpen(true)} className="bg-zinc-950 text-white text-sm font-semibold px-4 py-2 hover:bg-zinc-800 flex items-center gap-2" data-testid="team-invite-button">
                <Plus className="w-4 h-4" /> Add member
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-none">
              <DialogHeader>
                <DialogTitle>Add team member</DialogTitle>
              </DialogHeader>
              {tempCred ? (
                <div className="space-y-3" data-testid="invite-success">
                  <div className="text-sm">Member created. Share these credentials:</div>
                  <div className="bg-zinc-100 p-3 font-mono text-xs space-y-1">
                    <div>Email: <span className="font-bold">{tempCred.email}</span></div>
                    <div>Password: <span className="font-bold">{tempCred.password}</span></div>
                  </div>
                  <button onClick={() => { setTempCred(null); setOpen(false); }} className="bg-zinc-950 text-white px-4 py-2 text-sm font-semibold w-full" data-testid="invite-done">Done</button>
                </div>
              ) : (
                <form onSubmit={invite} className="space-y-3" data-testid="invite-form">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm" data-testid="invite-name" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm" data-testid="invite-email" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Role</label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger className="rounded-none" data-testid="invite-role"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-none">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="normal_user">Normal User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Initial password</label>
                    <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm font-mono" data-testid="invite-password" />
                  </div>
                  <DialogFooter>
                    <button type="submit" className="bg-zinc-950 text-white px-4 py-2 text-sm font-semibold w-full" data-testid="invite-submit">Add member</button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white border border-zinc-200 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-12 px-5 py-2 border-b border-zinc-200 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
            <div className="col-span-5">Member</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-zinc-200 min-w-[600px]" data-testid="team-table">
          {team.map((m) => (
            <div key={m.id || m._id} className="grid grid-cols-12 px-5 py-3 items-center" data-testid={`team-row-${m.id || m._id}`}>
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-8 h-8 flex-shrink-0 bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">{m.name?.[0]?.toUpperCase()}</div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{m.name}</div>
                  {(m.id === user?.id || m._id === user?.id) && <div className="text-[10px] font-mono text-zinc-500">you</div>}
                </div>
              </div>
              <div className="col-span-4 text-sm text-zinc-700 truncate">{m.email}</div>
              <div className="col-span-2">
                {isAdmin && (m.id !== user?.id && m._id !== user?.id) ? (
                  <Select value={m.role} onValueChange={(v) => updateRole(m.id || m._id, v)}>
                    <SelectTrigger className="h-8 rounded-none text-xs" data-testid={`team-role-${m.id || m._id}`}><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="normal_user">Normal User</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="inline-flex px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-zinc-100 border border-zinc-200">{m.role}</span>
                )}
              </div>
              <div className="col-span-1 text-right">
                {isAdmin && (m.id !== user?.id && m._id !== user?.id) && (
                  <button onClick={() => remove(m.id || m._id)} className="text-zinc-400 hover:text-red-600" data-testid={`team-remove-${m.id || m._id}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

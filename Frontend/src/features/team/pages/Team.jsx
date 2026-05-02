import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../../components/ui/dialog";
import { fetchTeam, inviteMember, removeMember, selectTeamMembers, selectTeamLoading } from "../team.slice";

export default function Team() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const allMembers = useSelector(selectTeamMembers) || [];
  const loading = useSelector(selectTeamLoading);
  
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  // Filter: Admin only sees themselves and developers. SuperAdmin sees everyone.
  const team = allMembers.filter(m => {
    if (isSuperAdmin) return true;
    const isMe = (m.id || m._id) === (user?.id || user?._id);
    const isDeveloper = m.role === 'developer';
    return isMe || isDeveloper;
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "developer", password: "changeme123" });
  const [tempCred, setTempCred] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await dispatch(inviteMember(form)).unwrap();
      setTempCred({ email: result.email, password: result.temp_password || form.password });
      setForm({ name: "", email: "", role: "developer", password: "changeme123" });
      toast.success("Member added successfully");
    } catch (err) {
      toast.error(err.detail || "Failed to invite member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this member? This action cannot be undone.")) return;
    try {
      await dispatch(removeMember(id)).unwrap();
      toast.success("Member removed");
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="team-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/team</div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Team</h1>
          <p className="text-sm text-zinc-600 mt-1">
            {team.length} member{team.length !== 1 && "s"} in <span className="font-mono font-bold text-zinc-950">{user?.org_name || 'Organization'}</span>
          </p>
        </div>
        
        {/* Only SuperAdmins or specific Admins can invite based on your business logic, keeping it for Admins here as requested previously */}
        {(isSuperAdmin || isAdmin) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-zinc-950 text-white text-sm font-bold px-4 py-2.5 hover:bg-zinc-800 flex items-center gap-2 neo-shadow" data-testid="team-invite-button">
                <Plus className="w-4 h-4" /> Add developer
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-none border-2 border-black neo-shadow">
              <DialogHeader>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">Add new developer</DialogTitle>
              </DialogHeader>
              
              {tempCred ? (
                <div className="space-y-4" data-testid="invite-success">
                  <div className="text-sm font-bold text-green-600">Developer added successfully!</div>
                  <div className="bg-zinc-50 p-4 border-2 border-dashed border-black font-mono text-xs space-y-2">
                    <div>Email: <span className="font-bold text-black select-all">{tempCred.email}</span></div>
                    <div>Password: <span className="font-bold text-black select-all">{tempCred.password}</span></div>
                  </div>
                  <button onClick={() => { setTempCred(null); setOpen(false); }} className="bg-zinc-950 text-white px-4 py-3 text-sm font-bold w-full neo-shadow" data-testid="invite-done">Done</button>
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4" data-testid="invite-form">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1.5">Full Name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1.5">Email Address</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 font-bold mb-1.5">Initial password</label>
                    <input required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-black focus:outline-none focus:bg-zinc-50 text-sm font-mono" />
                  </div>
                  <DialogFooter className="pt-2">
                    <button type="submit" disabled={submitting} className="bg-zinc-950 text-white px-4 py-3 text-sm font-bold w-full neo-shadow">
                      {submitting ? "Adding..." : "Add Developer"}
                    </button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white border-2 border-black neo-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-50 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-4 font-bold">Member</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-zinc-200" data-testid="team-table">
              {loading && team.length === 0 ? (
                <>
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 border-2 border-black" />
                        <div className="h-4 w-32 bg-zinc-100" />
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-48 bg-zinc-100" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-24 bg-zinc-100" /></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))}
                </>
              ) : team.map((m) => (
                <tr key={m.id || m._id} className="hover:bg-zinc-50 transition-colors" data-testid={`team-row-${m.id || m._id}`}>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-zinc-950 text-white text-sm font-black flex items-center justify-center border-2 border-black neo-shadow-sm">
                      {m.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-black text-zinc-950 truncate uppercase tracking-tight">{m.name}</div>
                      {(m.id === user?.id || m._id === user?.id) && <div className="text-[10px] font-mono font-bold text-[#FF6B6B]">YOU</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-600 font-medium font-mono truncate">{m.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    {/* As requested: Only role name as text, no dropdown */}
                    <span className="inline-flex px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-100 border-2 border-black">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Only allow removing if Admin is viewing a Developer, or SuperAdmin is viewing anyone else */}
                    {((isAdmin && m.role === 'developer') || (isSuperAdmin && (m.id !== user?.id && m._id !== user?.id))) && (
                      <button onClick={() => handleRemove(m.id || m._id)} className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

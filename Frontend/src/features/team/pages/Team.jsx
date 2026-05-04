import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { Plus, Trash2, ArrowLeft, UserPlus, User, Mail, Key, CheckCircle2 } from "lucide-react";
import ConfirmationModal from "../../../components/ConfirmationModal";
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
    const memberId = m._id || m.id;
    const currentUserId = user?._id || user?.id;
    const isMe = memberId === currentUserId;
    const isDeveloper = m.role === 'developer';
    return isMe || isDeveloper;
  });

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "developer", password: "changeme123" });
  const [tempCred, setTempCred] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, memberId: null });

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
    setConfirmModal({ isOpen: true, memberId: id });
  };

  const confirmRemove = async () => {
    const id = confirmModal.memberId;
    if (!id) return;
    try {
      await dispatch(removeMember(id)).unwrap();
      toast.success("Member removed");
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase italic">
            Team
          </h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">
            {team.length} member{team.length !== 1 && "s"} in <span className="font-mono">{user?.org_name || 'Organization'}</span>.
          </p>
        </div>
        
        {/* Only SuperAdmins or specific Admins can invite based on your business logic, keeping it for Admins here as requested previously */}
        {(isSuperAdmin || isAdmin) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-[#FF6B6B] text-black border-2 border-black text-sm font-black px-5 py-2.5 hover:translate-y-0.5 neo-shadow transition-all uppercase tracking-widest flex items-center gap-2" data-testid="team-invite-button">
                <Plus className="w-4 h-4 stroke-[3]" /> Add developer
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 overflow-hidden border-3 border-black neo-shadow-lg max-w-lg">
              <div className="bg-[#4FD1C5] p-6 border-b-3 border-black relative">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white border-2 border-black neo-shadow-sm">
                    <UserPlus className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black tracking-tight text-black uppercase">Add new developer</DialogTitle>
                    <p className="text-xs font-bold text-black/60 uppercase tracking-wider">Expand your technical team</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6">
                {tempCred ? (
                  <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300" data-testid="invite-success">
                    <div className="flex items-center gap-2 text-sm font-black text-emerald-600 uppercase">
                      <CheckCircle2 className="w-5 h-5" /> Developer added successfully!
                    </div>
                    <div className="bg-zinc-50 p-5 border-2 border-black neo-shadow-sm font-mono text-xs space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Key className="w-12 h-12" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase">Email Address</div>
                        <div className="font-black text-sm text-black select-all bg-white px-2 py-1 border border-zinc-200 inline-block">{tempCred.email}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] text-zinc-400 font-bold uppercase">Initial Password</div>
                        <div className="font-black text-sm text-black select-all bg-white px-2 py-1 border border-zinc-200 inline-block">{tempCred.password}</div>
                      </div>
                      <div className="pt-2 text-[10px] text-rose-500 font-bold italic">* Please share these credentials securely.</div>
                    </div>
                    <button 
                      onClick={() => { setTempCred(null); setOpen(false); }} 
                      className="bg-zinc-950 text-white px-4 py-4 text-sm font-black w-full neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all active:scale-[0.98]" 
                      data-testid="invite-done"
                    >
                      Got it, close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInvite} className="space-y-5" data-testid="invite-form">
                    <div className="space-y-1.5 group">
                      <label className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-900 font-black">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </label>
                      <input 
                        required 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0 focus:bg-zinc-50 text-sm neo-shadow-sm transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none" 
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-900 font-black">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                      </label>
                      <input 
                        required 
                        type="email" 
                        value={form.email} 
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0 focus:bg-zinc-50 text-sm neo-shadow-sm transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none font-mono" 
                        placeholder="john@organization.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-zinc-900 font-black">
                        <Key className="w-3.5 h-3.5" /> Initial Password
                      </label>
                      <input 
                        required 
                        value={form.password} 
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-0 focus:bg-zinc-50 text-sm neo-shadow-sm transition-all focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-none font-mono" 
                      />
                    </div>

                    <DialogFooter className="pt-2">
                      <button 
                        type="submit" 
                        disabled={submitting} 
                        className="bg-zinc-950 text-white px-6 py-4 text-sm font-black w-full neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {submitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" /> Add Developer
                          </>
                        )}
                      </button>
                    </DialogFooter>
                  </form>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="bg-white border-4 border-black neo-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b-4 border-black bg-[#D4F4E4] text-[11px] font-black uppercase tracking-widest text-black">
                <th className="px-6 py-5">Team Member</th>
                <th className="px-6 py-5">Email Address</th>
                <th className="px-6 py-5">Role & Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black/5" data-testid="team-table">
              {loading && team.length === 0 ? (
                <>
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 border-2 border-black" />
                        <div className="h-5 w-40 bg-zinc-100" />
                      </td>
                      <td className="px-6 py-6"><div className="h-4 w-48 bg-zinc-100" /></td>
                      <td className="px-6 py-6"><div className="h-10 w-32 bg-zinc-100" /></td>
                      <td className="px-6 py-6"></td>
                    </tr>
                  ))}
                </>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-50 border-2 border-black flex items-center justify-center">
                        <User className="w-8 h-8 text-zinc-300" />
                      </div>
                      <p className="text-sm font-black text-zinc-400 uppercase tracking-widest italic">No members found in this view.</p>
                    </div>
                  </td>
                </tr>
              ) : team.map((m) => (
                <tr key={m._id || m.id} className="hover:bg-zinc-50 transition-all group" data-testid={`team-row-${m._id || m.id}`}>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex-shrink-0 text-black text-lg font-black flex items-center justify-center border-4 border-black neo-shadow-sm ${(m._id || m.id) === (user?._id || user?.id) ? 'bg-[#FF6B6B]' : 'bg-white'}`}>
                        {m.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-base font-black text-black truncate uppercase tracking-tight flex items-center gap-2">
                          {m.name}
                          {(m._id || m.id) === (user?._id || user?.id) && (
                            <span className="bg-black text-white text-[9px] px-2 py-0.5 tracking-widest">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Joined {new Date(m.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm text-zinc-600 font-bold font-mono tracking-tighter">{m.email}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex w-fit px-3 py-1 text-[10px] font-black uppercase tracking-wider border-2 border-black ${m.role === 'admin' ? 'bg-[#FFB5E8]' : 'bg-[#D4F4E4]'}`}>
                        {m.role}
                      </span>
                      {m.isVerified ? (
                        <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1.5 uppercase italic">
                          <CheckCircle2 className="w-3 h-3" strokeWidth={3} /> Verified Member
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-amber-500 flex items-center gap-1.5 uppercase italic">
                          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse border border-black/20" /> Verification Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    {((isAdmin && m.role === 'developer') || (isSuperAdmin && (m._id !== user?._id && m.id !== user?.id))) ? (
                      <button 
                        onClick={() => handleRemove(m._id || m.id)} 
                        className="p-3 text-zinc-400 hover:text-black hover:bg-[#FF6B6B] transition-all border-2 border-transparent hover:border-black neo-shadow-sm hover:shadow-none"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    ) : (
                      <div className="text-[10px] font-black text-zinc-300 italic uppercase">Permanent</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, memberId: null })}
        onConfirm={confirmRemove}
        title="Remove Team Member?"
        message="Are you sure you want to remove this member? They will lose all access to the organization's incidents and data immediately. This action cannot be undone."
        confirmText="Remove Member"
      />
    </div>
  );
}

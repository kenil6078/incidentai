import React, { useState, useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { toast } from "sonner";
import { 
  Users, Building2, ShieldCheck, Search, ArrowUpRight, 
  UserCheck, ShieldAlert, X, Edit2, Ban, CreditCard, Save, Trash2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function SuperAdminDashboard() {
  const { 
    organizations, users, loading, getOrganizations, getUsers, 
    updateUser, toggleBan, updatePlan, deleteUser, deleteOrg 
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [view, setView] = useState("organizations");
  const [roleFilter, setRoleFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    getOrganizations();
    getUsers();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
    };

    try {
      await updateUser(selectedUser._id, userData);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.detail || "Failed to update user");
    }
  };

  const handleToggleBan = async (userId) => {
    try {
      await toggleBan(userId);
      toast.success("User status updated");
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    const plan = new FormData(e.target).get("plan");
    try {
      await updatePlan(selectedOrg._id, plan);
      toast.success("Plan updated successfully");
      setIsPlanModalOpen(false);
    } catch (err) {
      toast.error("Failed to update plan");
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmModal({ isOpen: true, type: 'user', id: userId });
  };

  const handleDeleteOrg = async (orgId) => {
    setConfirmModal({ isOpen: true, type: 'org', id: orgId });
  };

  const handleConfirmAction = async () => {
    const { type, id } = confirmModal;
    if (!id) return;

    try {
      if (type === 'user') {
        await deleteUser(id);
        toast.success("User deleted successfully");
      } else if (type === 'org') {
        await deleteOrg(id);
        toast.success("Organization deleted successfully");
      }
    } catch (err) {
      toast.error(err.detail || `Failed to delete ${type}`);
    }
  };

  const handleManageOrg = (orgId) => {
    setOrgFilter(orgId);
    setView("users");
    setSearchTerm("");
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesOrg = orgFilter === "all" || user.orgId?._id === orgFilter || user.orgId === orgFilter;
    return matchesSearch && matchesRole && matchesOrg;
  });

  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#FAFAFA]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2 font-black">Platform Control</div>
          <h1 className="text-5xl font-black tracking-tighter text-black uppercase italic">Super Admin.</h1>
        </div>
        <div className="flex flex-wrap gap-4">
           <div className="bg-[#D4F4E4] border-4 border-black p-4 neo-shadow flex items-center gap-4">
              <Building2 className="w-8 h-8 text-black" />
              <div>
                <div className="text-[10px] font-mono uppercase font-black text-black/50">Companies</div>
                <div className="text-2xl font-black text-black">{organizations.length}</div>
              </div>
           </div>
           <div className="bg-[#FFB5E8] border-4 border-black p-4 neo-shadow flex items-center gap-4">
              <Users className="w-8 h-8 text-black" />
              <div>
                <div className="text-[10px] font-mono uppercase font-black text-black/50">Total Users</div>
                <div className="text-2xl font-black text-black">{users.length}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex border-b-4 border-black gap-1">
        <button 
          onClick={() => setView("organizations")}
          className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all ${view === "organizations" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"}`}
        >
          Organizations
        </button>
        <button 
          onClick={() => { setView("users"); setOrgFilter("all"); }}
          className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all ${view === "users" && orgFilter === "all" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"}`}
        >
          User Directory
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text"
            placeholder={view === "organizations" ? "Search by organization name or slug..." : "Search by user name or email..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black neo-shadow text-lg font-bold focus:outline-none focus:bg-[#FDE68A] transition-all"
          />
        </div>
        {view === "users" && (
          <div className="flex gap-4">
            {orgFilter !== "all" && (
              <div className="flex items-center gap-2 bg-[#FDE68A] border-4 border-black px-4 py-2 font-bold neo-shadow whitespace-nowrap">
                <Building2 className="w-4 h-4" />
                <span className="text-xs uppercase italic truncate max-w-[150px]">
                  {organizations.find(o => o._id === orgFilter)?.name}
                </span>
                <button onClick={() => setOrgFilter("all")} className="hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border-4 border-black neo-shadow px-6 py-2 font-bold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="developer">Developers</option>
              <option value="super_admin">Super Admins</option>
            </select>
          </div>
        )}
      </div>

      {view === "organizations" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-zinc-100 border-4 border-black animate-pulse" />
            ))
          ) : filteredOrgs.length > 0 ? (
            filteredOrgs.map((org) => (
              <div key={org._id} className="bg-white border-4 border-black neo-shadow p-6 flex flex-col hover:translate-y-1 hover:shadow-none transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-black tracking-tight uppercase italic">{org.name}</h3>
                    <div className="text-xs font-mono text-zinc-500 font-bold">/{org.slug}</div>
                  </div>
                  <button 
                    onClick={() => { setSelectedOrg(org); setIsPlanModalOpen(true); }}
                    className={`border-2 border-black px-3 py-1 text-[10px] font-black uppercase transition-all hover:bg-black hover:text-white flex items-center gap-2 ${
                      org.plan === 'enterprise' ? 'bg-[#FDE68A]' : 
                      org.plan === 'pro' ? 'bg-[#FF6B6B]' : 'bg-[#D4F4E4]'
                    }`}
                  >
                    <CreditCard className="w-3 h-3" /> {org.plan}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-2 bg-[#FDE68A] border-2 border-black neo-shadow-sm">
                    <div className="text-xs font-black text-black">{org.counts?.admins || 0}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Admins</div>
                  </div>
                  <div className="text-center p-2 bg-[#FFB5E8] border-2 border-black neo-shadow-sm">
                    <div className="text-xs font-black text-black">{org.counts?.developers || 0}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Devs</div>
                  </div>
                  <div className="text-center p-2 bg-[#E2E8F0] border-2 border-black neo-shadow-sm">
                    <div className="text-xs font-black text-black">{(org.counts?.total || 0) - (org.counts?.admins || 0) - (org.counts?.developers || 0)}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Others</div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t-2 border-black flex items-center justify-between">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleDeleteOrg(org._id)}
                      className="p-2 bg-red-50 text-red-500 border-2 border-black neo-shadow-sm hover:bg-red-500 hover:text-white hover:shadow-none hover:translate-y-0.5 transition-all"
                      title="Delete Organization"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleManageOrg(org._id)}
                      className="flex items-center gap-1 text-sm font-black text-black hover:underline group-hover:translate-x-1 transition-transform"
                    >
                      Manage <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-zinc-200">
              <div className="text-xl font-bold text-zinc-400 font-mono">NO ORGANIZATIONS FOUND.</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border-4 border-black neo-shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black text-white border-b-4 border-black">
              <tr>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black">User</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black">Organization</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black">Role</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black">Status</th>
                <th className="px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {filteredUsers.map((user) => (
                <tr key={user._id} className={`hover:bg-zinc-50 transition-colors ${!user.active ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFB5E8] border-2 border-black flex items-center justify-center font-black neo-shadow-sm">
                        {user.name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-black">{user.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono font-bold uppercase">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {user.orgId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black neo-shadow-sm ${
                      user.role === 'admin' ? 'bg-[#FDE68A]' : 
                      user.role === 'developer' ? 'bg-[#D4F4E4]' : 
                      user.role === 'super_admin' ? 'bg-black text-white' : 'bg-[#E2E8F0]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                        {user.isVerified ? (
                          <><UserCheck className="w-3 h-3 text-green-600" strokeWidth={4} /> Verified</>
                        ) : (
                          <><ShieldAlert className="w-3 h-3 text-red-500" strokeWidth={4} /> Pending</>
                        )}
                      </div>
                      {!user.active && (
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-red-600">
                          <Ban className="w-3 h-3" strokeWidth={4} /> Banned
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                        className="p-2 bg-[#FDE68A] border-2 border-black neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4 text-black" />
                      </button>
                      <button 
                        onClick={() => handleToggleBan(user._id)}
                        className={`p-2 border-2 border-black neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all ${user.active ? 'bg-white hover:bg-orange-400 group' : 'bg-orange-400'}`}
                        title={user.active ? "Ban User" : "Unban User"}
                      >
                        <Ban className={`w-4 h-4 ${user.active ? 'text-black group-hover:text-white' : 'text-white'}`} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 bg-red-500 border-2 border-black neo-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all text-white"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border-4 border-black neo-shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black uppercase italic leading-none">Edit User.</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-100 border-2 border-transparent hover:border-black transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-2 block">Full Name</label>
                  <input 
                    name="name"
                    defaultValue={selectedUser.name}
                    className="w-full p-4 bg-zinc-50 border-2 border-black font-bold focus:outline-none focus:bg-[#FDE68A] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-2 block">Email Address</label>
                  <input 
                    name="email"
                    type="email"
                    defaultValue={selectedUser.email}
                    className="w-full p-4 bg-zinc-50 border-2 border-black font-bold focus:outline-none focus:bg-[#FDE68A] transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500 mb-2 block">System Role</label>
                  <select 
                    name="role"
                    defaultValue={selectedUser.role}
                    className="w-full p-4 bg-zinc-50 border-2 border-black font-bold focus:outline-none focus:bg-[#FDE68A] transition-colors appearance-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="developer">Developer</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white text-sm font-black uppercase tracking-widest border-2 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subscription Modal */}
      <AnimatePresence>
        {isPlanModalOpen && selectedOrg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPlanModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border-4 border-black neo-shadow-lg p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-[8px] font-mono font-black uppercase text-zinc-400">Subscription Control</div>
                  <h2 className="text-2xl font-black uppercase italic leading-none">{selectedOrg.name}</h2>
                </div>
                <button onClick={() => setIsPlanModalOpen(false)} className="p-2 hover:bg-zinc-100 border-2 border-transparent hover:border-black transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdatePlan} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {['free', 'pro', 'enterprise'].map((plan) => (
                    <label key={plan} className="relative cursor-pointer">
                      <input 
                        type="radio" 
                        name="plan" 
                        value={plan} 
                        defaultChecked={selectedOrg.plan === plan}
                        className="peer sr-only"
                      />
                      <div className={`p-4 border-2 border-black font-black uppercase text-sm flex justify-between items-center transition-all peer-checked:bg-black peer-checked:text-white hover:bg-zinc-50 peer-checked:hover:bg-black`}>
                        {plan}
                        {selectedOrg.plan === plan && <ShieldCheck className="w-4 h-4" />}
                      </div>
                    </label>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#FF6B6B] text-black text-sm font-black uppercase tracking-widest border-2 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <CreditCard className="w-5 h-5" /> Update Subscription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, id: null })}
        onConfirm={handleConfirmAction}
        title={`Delete ${confirmModal.type === 'user' ? 'User' : 'Organization'}?`}
        message={
          confirmModal.type === 'user' 
            ? "Are you sure you want to PERMANENTLY DELETE this user? This action cannot be undone and will remove all their profile data."
            : "Are you sure you want to PERMANENTLY DELETE this organization? ALL data associated with it (incidents, team members, services) will be lost forever."
        }
        confirmText={`Delete ${confirmModal.type === 'user' ? 'User' : 'Org'}`}
      />
    </div>
  );
}

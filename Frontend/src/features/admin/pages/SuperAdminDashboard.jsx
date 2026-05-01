import React, { useState, useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import { toast } from "sonner";
import { Users, Building2, ShieldCheck, Search, ArrowUpRight, UserCheck, ShieldAlert } from "lucide-react";

export default function SuperAdminDashboard() {
  const { organizations, users, loading, getOrganizations, getUsers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState("organizations"); // 'organizations' or 'users'
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    getOrganizations();
    getUsers();
  }, []);

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2 font-black">Platform Control</div>
          <h1 className="text-5xl font-black tracking-tighter text-black">Super Admin.</h1>
        </div>
        <div className="flex flex-wrap gap-4">
           <div className="bg-[#D4F4E4] border-2 border-black p-4 neo-shadow flex items-center gap-4">
              <Building2 className="w-8 h-8 text-black" />
              <div>
                <div className="text-[10px] font-mono uppercase font-black text-black/50">Companies</div>
                <div className="text-2xl font-black text-black">{organizations.length}</div>
              </div>
           </div>
           <div className="bg-[#FFB5E8] border-2 border-black p-4 neo-shadow flex items-center gap-4">
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
          onClick={() => setView("users")}
          className={`px-8 py-3 text-sm font-black uppercase tracking-widest transition-all ${view === "users" ? "bg-black text-white" : "bg-white text-black hover:bg-zinc-100"}`}
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
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border-4 border-black neo-shadow px-4 py-2 font-bold focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="developer">Developers</option>
            <option value="viewer">Viewers</option>
          </select>
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
              <div key={org._id} className="bg-white border-4 border-black neo-shadow p-6 flex flex-col hover:translate-y-1 hover:shadow-none transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-black tracking-tight">{org.name}</h3>
                    <div className="text-xs font-mono text-zinc-500 font-bold">/{org.slug}</div>
                  </div>
                  <div className="bg-[#D4F4E4] border-2 border-black px-2 py-1 text-[10px] font-black uppercase">
                    {org.plan}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-2 bg-[#FDE68A] border-2 border-black">
                    <div className="text-xs font-black text-black">{org.counts?.admins || 0}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Admins</div>
                  </div>
                  <div className="text-center p-2 bg-[#FFB5E8] border-2 border-black">
                    <div className="text-xs font-black text-black">{org.counts?.developers || 0}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Devs</div>
                  </div>
                  <div className="text-center p-2 bg-[#E2E8F0] border-2 border-black">
                    <div className="text-xs font-black text-black">{(org.counts?.total || 0) - (org.counts?.admins || 0) - (org.counts?.developers || 0)}</div>
                    <div className="text-[8px] font-mono uppercase font-black text-black/50">Others</div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t-2 border-black flex items-center justify-between">
                  <div className="text-[10px] font-mono text-zinc-400 font-bold">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </div>
                  <button className="flex items-center gap-1 text-sm font-black text-black hover:underline">
                    Manage <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-zinc-200">
              <div className="text-xl font-bold text-zinc-400">No organizations found.</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border-4 border-black neo-shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black text-white border-b-4 border-black">
              <tr>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em]">User</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em]">Organization</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em]">Role</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-4 text-xs font-mono uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FFB5E8] border-2 border-black flex items-center justify-center font-black">
                        {user.name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-black text-black">{user.name}</div>
                        <div className="text-xs text-zinc-500 font-bold">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {user.orgId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase border-2 border-black ${
                      user.role === 'admin' ? 'bg-[#FDE68A]' : 
                      user.role === 'developer' ? 'bg-[#D4F4E4]' : 'bg-[#E2E8F0]'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {user.isVerified ? (
                        <><UserCheck className="w-3 h-3 text-green-600" strokeWidth={3} /> Verified</>
                      ) : (
                        <><ShieldAlert className="w-3 h-3 text-red-500" strokeWidth={3} /> Pending</>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-black text-black underline decoration-2 underline-offset-2 hover:text-[#FF6B6B]">
                      Edit User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

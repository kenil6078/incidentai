import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/hook/useAuth";
import { toast } from "sonner";
import api from 'axios';
import { Save, User, Shield, Bell, Globe, ArrowLeft } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.put("/auth/me", form);
      setUser(r.data);
      toast.success("Profile updated");
    } catch (e) { toast.error("Update failed"); }
    finally { setLoading(false); }
  };

  const TABS = [
    { icon: User, label: "Profile" },
    { icon: Shield, label: "Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Globe, label: "Organization" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950" data-testid="settings-back">
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/settings</div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950">Settings</h1>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-8">
        <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-zinc-200 md:space-y-1 mb-4 md:mb-0 pb-2 md:pb-0">
          {TABS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 md:px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.label ? "bg-zinc-900 text-white md:bg-zinc-900" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3 space-y-6">
          {activeTab === "Profile" && (
            <form onSubmit={save} className="bg-white border border-zinc-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-zinc-950 mb-4">Personal Information</h2>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Email Address</label>
                <input
                  value={form.email}
                  disabled
                  className="w-full px-3 py-2 border border-zinc-300 bg-zinc-50 text-zinc-500 text-sm cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-400 mt-1">Contact admin to change your email.</p>
              </div>
              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-zinc-950 text-white px-4 py-2 text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "Organization" && (
            <div className="bg-white border border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-950 mb-1">Organization</h2>
              <p className="text-sm text-zinc-500 mb-4">Your current active workspace.</p>
              <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200">
                <div className="w-12 h-12 bg-zinc-950 flex items-center justify-center text-white font-black text-xl uppercase">
                  {user?.org_name?.[0]}
                </div>
                <div>
                  <div className="font-bold text-zinc-950">{user?.org_name}</div>
                  <div className="text-xs text-zinc-500 font-mono">Workspace ID: {user?.id?.slice(-8) || "N/A"}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="bg-white border border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-950 mb-1">Security Settings</h2>
              <p className="text-sm text-zinc-500 mb-4">Manage your password and security preferences.</p>
              <div className="text-sm text-zinc-600">Password management is handled by your organization's SSO provider.</div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-white border border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-950 mb-1">Notification Preferences</h2>
              <p className="text-sm text-zinc-500 mb-4">Choose how you want to be notified.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-zinc-950" />
                  <span className="text-sm text-zinc-800">Email me when I am assigned to an incident</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-zinc-950" />
                  <span className="text-sm text-zinc-800">Email me when a critical incident is created</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

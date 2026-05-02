import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { toast } from "sonner";
import * as authApi from "../../auth/services/auth.api";
import { Save, User, Shield, Bell, Globe, ArrowLeft, CreditCard, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await authApi.updateProfile(form);
      setUser(r.user);
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setLoading(true);
    try {
      const r = await authApi.updatePassword({
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      setUser(r.user);
      toast.success("Password updated successfully");
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    { icon: User, label: "Profile" },
    { icon: Shield, label: "Security" },
    { icon: Bell, label: "Notifications" },
    { icon: Globe, label: "Organization" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950"
        data-testid="settings-back"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
      </button>

      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">
          /settings
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950">
          Settings
        </h1>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-8">
        <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-zinc-200 md:space-y-1 mb-4 md:mb-0 pb-2 md:pb-0">
          {TABS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 md:px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === item.label
                  ? "bg-zinc-900 text-white md:bg-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="md:col-span-3 space-y-6">
          {activeTab === "Profile" && (
            <form
              onSubmit={save}
              className="bg-white border-2 border-black neo-shadow p-6 space-y-4"
            >
              <h2 className="text-lg font-black tracking-tight text-zinc-950 mb-4 uppercase">
                Personal Information
              </h2>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5 font-bold">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border-2 border-black focus:outline-none focus:bg-[#D4F4E4] text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5 font-bold">
                  Email Address
                </label>
                <input
                  value={form.email}
                  disabled
                  className="w-full px-3 py-2.5 border-2 border-black bg-zinc-100 text-zinc-500 text-sm cursor-not-allowed font-medium"
                />
                <p className="text-[10px] text-zinc-400 mt-1 italic font-medium">
                  Contact admin to change your email.
                </p>
              </div>
              <div className="pt-4 border-t-2 border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FF6B6B] text-black border-2 border-black px-6 py-2 text-sm font-black neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:neo-shadow-none disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />{" "}
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "Organization" && (
            <div className="bg-white border-2 border-black neo-shadow p-6">
              <h2 className="text-lg font-black tracking-tight text-zinc-950 mb-1 uppercase">
                Organization
              </h2>
              <p className="text-xs text-zinc-500 mb-6 font-medium italic">
                Your current active workspace and team affiliation.
              </p>
              <div className="flex items-center gap-6 p-6 bg-[#FDE68A] border-2 border-black neo-shadow-sm">
                <div className="w-16 h-16 bg-zinc-950 border-2 border-black flex items-center justify-center text-white font-black text-3xl uppercase">
                  {user?.org_name?.[0]}
                </div>
                <div>
                  <div className="text-xl font-black text-zinc-950 uppercase tracking-tighter">
                    {user?.org_name}
                  </div>
                  <div className="text-[10px] text-zinc-700 font-mono font-bold mt-1">
                    WORKSPACE ID: {user?.orgId || "N/A"}
                  </div>
                  <div className="mt-2 inline-block px-2 py-0.5 bg-white border border-black text-[9px] font-bold uppercase tracking-widest">
                    Active Subscription
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <form 
              onSubmit={handleUpdatePassword}
              className="bg-white border-2 border-black neo-shadow p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-black tracking-tight text-zinc-950 mb-1 uppercase">
                  Security Settings
                </h2>
                <p className="text-xs text-zinc-500 mb-4 font-medium italic">
                  {user?.hasPassword 
                    ? "Update your password to keep your account secure." 
                    : "You logged in with Google. Set a password to enable manual login."}
                </p>
              </div>

              <div className="space-y-4">
                {user?.hasPassword === true && (
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5 font-bold">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2.5 border-2 border-black focus:outline-none focus:bg-[#FDE68A] text-sm font-medium pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5 font-bold">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2.5 border-2 border-black focus:outline-none focus:bg-[#D4F4E4] text-sm font-medium pr-10"
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5 font-bold">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2.5 border-2 border-black focus:outline-none focus:bg-[#D4F4E4] text-sm font-medium pr-10"
                        placeholder="Re-type new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-950"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#FF6B6B] text-black border-2 border-black px-6 py-2 text-sm font-black neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:neo-shadow-none disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  <Shield className="w-4 h-4" />{" "}
                  {loading ? "Updating..." : user?.hasPassword ? "Update Password" : "Set Password"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "Notifications" && (
            <div className="bg-white border-2 border-black neo-shadow p-6">
              <h2 className="text-lg font-black tracking-tight text-zinc-950 mb-1 uppercase">
                Notification Preferences
              </h2>
              <p className="text-xs text-zinc-500 mb-6 font-medium italic">
                Choose how you want to be notified about incident updates.
              </p>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border-2 border-black bg-[#FAFAFA] cursor-pointer hover:bg-white transition-colors group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 border-2 border-black text-black rounded-none focus:ring-0"
                  />
                  <div>
                    <span className="text-sm font-black text-zinc-950 uppercase block">Incident Assignments</span>
                    <span className="text-[10px] text-zinc-500 font-medium">Email me immediately when I'm assigned as a responder.</span>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 border-2 border-black bg-[#FAFAFA] cursor-pointer hover:bg-white transition-colors group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 border-2 border-black text-black rounded-none focus:ring-0"
                  />
                  <div>
                    <span className="text-sm font-black text-zinc-950 uppercase block">Critical Alerts</span>
                    <span className="text-[10px] text-zinc-500 font-medium">Notify me about any critical priority incidents in my org.</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

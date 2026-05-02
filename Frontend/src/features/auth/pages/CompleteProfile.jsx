import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as authApi from '../services/auth.api';
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function CompleteProfile() {
  const { user, handleGetMe } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("admin");
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user && user.profileCompleted) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await authApi.getOrganizations();
        if (res.success) {
          setOrganizations(res.organizations);
        }
      } catch (err) {
        console.error("Failed to load organizations");
      }
    };
    if (role === "developer") {
      fetchOrgs();
    }
  }, [role]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user?.hasPassword && password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setLoading(true);
    try {
      const payload = { role };
      if (role === "admin") {
        payload.orgName = orgName;
        payload.address = address;
      } else if (role === "developer") {
        payload.orgId = orgId;
      }

      if (!user?.hasPassword && password) {
        payload.password = password;
      }

      await authApi.finalizeProfile(payload);
      await handleGetMe(); // Refresh user state
      toast.success("Profile completed successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA]">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="max-w-sm w-full">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2">Almost there.</h1>
          <p className="text-sm text-zinc-600 mb-8">Tell us how you'll be using incident.ai.</p>

          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-xs font-bold border-2 border-black neo-shadow transition-all ${role === "admin" ? "bg-[#FFB5E8] shadow-none translate-y-0.5" : "bg-white"}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("developer")}
              className={`flex-1 py-2 text-xs font-bold border-2 border-black neo-shadow transition-all ${role === "developer" ? "bg-[#D4F4E4] shadow-none translate-y-0.5" : "bg-white"}`}
            >
              Developer
            </button>
            <button
              type="button"
              onClick={() => setRole("normal_user")}
              className={`flex-1 py-2 text-xs font-bold border-2 border-black neo-shadow transition-all ${role === "normal_user" ? "bg-[#FDE68A] shadow-none translate-y-0.5" : "bg-white"}`}
            >
              User
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4 neo-card p-6 bg-white border-2 border-black">
            {!user?.hasPassword && (
              <React.Fragment>
                <div className="p-3 bg-[#FDE68A] border-2 border-black mb-2">
                  <p className="text-[10px] font-bold leading-tight uppercase italic">Secure your account by setting a manual login password.</p>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-black focus:outline-none focus:bg-[#D4F4E4] text-sm neo-shadow pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-950"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-black focus:outline-none focus:bg-[#D4F4E4] text-sm neo-shadow pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-950"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="border-b-2 border-black my-4 opacity-10"></div>
              </React.Fragment>
            )}

            {role === "admin" && (
              <React.Fragment>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Organization name</label>
                  <input
                    type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FFB5E8] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Organization Address</label>
                  <input
                    type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                    placeholder="123 Main St, NY"
                  />
                </div>
              </React.Fragment>
            )}

            {role === "developer" && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Select Organization</label>
                <select
                  required value={orgId} onChange={(e) => setOrgId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border-2 border-black focus:outline-none focus:bg-[#FFB5E8] text-sm neo-shadow"
                >
                  <option value="" disabled>Select an organization</option>
                  {organizations.map(org => (
                    <option key={org._id} value={org._id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            {role === "normal_user" && (
              <p className="text-sm text-zinc-600 mb-4">You will join as a normal user. No organization required.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#FF6B6B] text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : "Complete Profile"} <ArrowRight className="w-4 h-4" strokeWidth={3} />
            </button>
          </form>
        </div>
      </div>
      
      <div className="hidden lg:block bg-[#FFB5E8] border-l-2 border-black relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import * as authApi from '../services/auth.api';
import { toast } from "sonner";
import { 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Code2, 
  User, 
  Building2, 
  MapPin, 
  Lock,
  Loader2,
  CheckCircle2
} from "lucide-react";

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
      await handleGetMe(); 
      toast.success("Welcome aboard!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'admin', title: 'Admin', desc: 'Create & manage organization', color: 'bg-[#FFB5E8]', icon: ShieldCheck },
    { id: 'developer', title: 'Developer', desc: 'Join an existing team', color: 'bg-[#D4F4E4]', icon: Code2 },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA] selection:bg-black selection:text-white overflow-hidden">
      {/* --- Left Side: Form --- */}
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative h-screen overflow-y-auto custom-scrollbar">
        <div className="max-w-md w-full mx-auto space-y-10">
          <header className="space-y-2">
            <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">Final Step</div>
            <h1 className="text-5xl font-black tracking-tighter text-black leading-none">Complete your<br/>profile.</h1>
            <p className="text-zinc-500 font-bold">Choose your role and setup your workspace.</p>
          </header>

          <div className="space-y-8">
            {/* --- Role Selection (Only Admin & Developer) --- */}
            <div className="space-y-4">
              <label className="block text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 font-black ml-1">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`group relative flex flex-col p-4 border-4 border-black transition-all text-left ${
                      role === r.id ? `${r.color} translate-x-1 -translate-y-1 neo-shadow` : "bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className={`w-10 h-10 border-2 border-black flex items-center justify-center mb-3 ${role === r.id ? 'bg-white' : r.color}`}>
                      <r.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic text-xs tracking-tight">{r.title}</h3>
                      <p className="text-[9px] font-bold text-zinc-500 leading-tight mt-1">{r.desc}</p>
                    </div>
                    {role === r.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="bg-white border-4 border-black p-8 neo-shadow-lg space-y-6">
              
              {/* --- Password Section (Only if Google User without password) --- */}
              {!user?.hasPassword && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FDE68A] border-2 border-black flex items-start gap-3">
                    <Lock className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-black leading-snug uppercase italic">Important: Since you used Google, please set a password for manual login backup.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black mb-1.5 ml-1">Create Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-4 pr-12 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="••••••••"
                        />
                        <button
                          type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black mb-1.5 ml-1">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-4 pr-12 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="••••••••"
                        />
                        <button
                          type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="border-b-2 border-black/10 my-6" />
                </div>
              )}

              {/* --- Role Specific Fields --- */}
              <div className="space-y-4">
                {role === "admin" ? (
                  <>
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black mb-1.5 ml-1">Organization Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black" />
                        <input
                          type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="e.g. Stark Industries"
                        />
                      </div>
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black mb-1.5 ml-1">Office Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black" />
                        <input
                          type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="123 Silicon Valley, CA"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-black mb-1.5 ml-1">Choose Organization</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black" />
                      <select
                        required value={orgId} onChange={(e) => setOrgId(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold appearance-none"
                      >
                        <option value="" disabled>Select from the list</option>
                        {organizations.map(org => (
                          <option key={org._id} value={org._id}>{org.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B6B] text-black border-4 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:translate-y-1.5"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "COMPLETE SETUP"} 
                {!loading && <ArrowRight className="w-5 h-5" strokeWidth={3} />}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- Right Side: Aesthetic Section --- */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#D4F4E4] border-l-4 border-black p-12 relative overflow-hidden h-screen">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="w-32 h-32 bg-white border-4 border-black neo-shadow mx-auto flex items-center justify-center rotate-3">
            <CheckCircle2 className="w-16 h-16 text-black" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-4xl font-black italic tracking-tighter uppercase text-black leading-none">Security<br/>First.</h2>
            <p className="mt-4 text-sm font-bold text-zinc-600 max-w-xs mx-auto">
              Choose your role carefully. Admins manage teams, while Developers respond to incidents.
            </p>
          </div>
        </div>

        {/* Decorative Floating Card */}
        <div className="absolute bottom-12 right-12 w-48 h-48 bg-[#FFB5E8] border-4 border-black neo-shadow -rotate-6 hidden xl:block">
           <div className="p-4 space-y-2">
              <div className="w-full h-4 bg-black/10" />
              <div className="w-3/4 h-4 bg-black/10" />
              <div className="w-full h-12 bg-black/20 mt-4" />
           </div>
        </div>
      </div>
    </div>
  );
}

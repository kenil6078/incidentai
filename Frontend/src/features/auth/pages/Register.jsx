import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight, User, Mail, Lock, Building, MapPin, Search, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as authApi from '../services/auth.api';
import GoogleButton from "../components/GoogleButton";

export default function Register() {
  const [role, setRole] = useState("admin"); // 'admin', 'developer'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [address, setAddress] = useState("");
  const [orgId, setOrgId] = useState("");
  const [organizations, setOrganizations] = useState([]);
  
  const [success, setSuccess] = useState(false);
  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();

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
    try {
      const payload = { name, email, password, role };
      if (role === "admin") {
        payload.orgName = orgName;
        payload.address = address;
      } else if (role === "developer") {
        payload.orgId = orgId;
      }

      await handleRegister(payload);
      setSuccess(true);
      toast.success("Registration successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white selection:bg-black selection:text-white">
      {/* Left Side: Visual/Branding (Matches Login) */}
      <div className="hidden lg:flex w-[45%] bg-black relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-[#FF6B6B]/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" 
        />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-black border-2 border-white neo-shadow flex items-center justify-center">
            <span className="text-[#FF6B6B] font-black text-lg uppercase italic">i</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase italic">Incident.ai</span>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full animate-pulse" />
              Scale with Confidence
            </div>
            <h2 className="text-6xl font-black text-white leading-none tracking-tighter mb-6">
              Join the<br />
              <span className="text-[#FF6B6B]">Network</span>.
            </h2>
            <p className="text-zinc-400 text-lg max-w-sm font-medium leading-tight">
              Create your workspace and start managing incidents with AI-powered automation.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-end items-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          <span>© 2026 INCIDENT_AI</span>
        </div>
      </div>

      {/* Right Side: Form (Matches Login style) */}
      <div className="flex-1 flex flex-col items-center p-8 bg-[#FAFAFA] relative overflow-y-auto custom-scrollbar py-12">
        <div className="absolute top-8 right-8 lg:hidden">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-black underline decoration-2">Home</Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md my-auto"
        >
          {success ? (
            <div className="bg-white border-4 border-black p-8 neo-shadow-lg text-center">
              <div className="w-16 h-16 bg-[#D4F4E4] border-2 border-black neo-shadow flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-black mb-2">Check your inbox</h1>
              <p className="text-sm font-bold text-zinc-600 mb-8 leading-snug">
                We've sent a magic link to <span className="text-black">{email}</span>. Please verify your account to start solving incidents.
              </p>
              <Link 
                to="/login" 
                className="w-full bg-black text-white border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                GO TO LOGIN <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center lg:text-left pt-4">
                <h1 className="text-5xl font-black tracking-tighter text-black mb-2">Register.</h1>
                <p className="text-zinc-500 font-bold">Enter your details to create your workspace.</p>
              </div>

              {/* Role Selection (Neubrutalist style) */}
              <div className="flex p-1 bg-zinc-200 border-2 border-black neo-shadow-sm">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${role === "admin" ? "bg-white border-2 border-black" : "text-zinc-500"}`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("developer")}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${role === "developer" ? "bg-white border-2 border-black" : "text-zinc-500"}`}
                >
                  Developer
                </button>
              </div>

              <form onSubmit={submit} className="bg-white border-4 border-black p-8 neo-shadow-lg space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                        placeholder="Jane Smith"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        <input
                          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="jane@acme.com"
                        />
                      </div>
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                        <input
                          type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {role === "admin" ? (
                      <motion.div 
                        key="admin"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="relative group">
                            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Org Name</label>
                            <div className="relative">
                              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                              <input
                                type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#FFB5E8]/10 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                                placeholder="Acme Inc"
                              />
                            </div>
                          </div>
                          <div className="relative group">
                            <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Location</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                              <input
                                type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                                placeholder="London, UK"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="dev"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        <div className="relative group">
                          <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Select Workspace</label>
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                            <select
                              required value={orgId} onChange={(e) => setOrgId(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-[#D4F4E4]/10 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold appearance-none"
                            >
                              <option value="" disabled>Choose your company...</option>
                              {organizations.map(org => (
                                <option key={org._id} value={org._id}>{org.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B6B] text-black border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:translate-y-1.5"
                >
                  {loading ? "CREATING..." : "GET STARTED"} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t-2 border-black opacity-10"></div>
                  <span className="flex-shrink-0 mx-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest">or continue with</span>
                  <div className="flex-grow border-t-2 border-black opacity-10"></div>
                </div>

                <GoogleButton />
              </form>

              <p className="text-center text-sm font-bold text-zinc-500 pb-4">
                Already have an account?{" "}
                <Link to="/login" className="text-black underline decoration-2 underline-offset-4 hover:text-[#FF6B6B] transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>

    </div>
  );
}

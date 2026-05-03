import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import GoogleButton from "../components/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  
  const { handleLogin, handleResendEmail, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isVerified !== false) {
      if (user.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setUnverifiedEmail("");
    try {
      const response = await handleLogin({ email, password });
      toast.success("Welcome back");
      if (response.user.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.unverified || err.response?.data?.err === "email not verified") {
        setUnverifiedEmail(email);
        toast.error("Please verify your email first.");
      } else {
        toast.error(err.response?.data?.message || err.response?.data?.detail || "Login failed");
      }
    }
  };

  const onResend = async () => {
    try {
      await handleResendEmail({ email: unverifiedEmail });
      toast.success("Verification email resent!");
    } catch (err) {
      toast.error("Failed to resend email.");
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-white selection:bg-black selection:text-white">
      {/* Left Side: Visual/Branding (Fixed) */}
      <div className="hidden lg:flex w-[45%] bg-black relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        
        {/* Animated Orbs for premium feel */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px]" 
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
          <span className="text-xl font-black tracking-tight text-white uppercase italic">incident.ai</span>
        </Link>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Intelligence Driven Ops
            </div>
            <h2 className="text-6xl font-black text-white leading-none tracking-tighter mb-6">
              Control the<br />
              <span className="text-[#FF6B6B]">Chaos</span>.
            </h2>
            <p className="text-zinc-400 text-lg max-w-sm font-medium leading-tight">
              The command center for modern engineering teams. Resolve incidents faster with AI-powered insights.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 flex justify-end items-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
          <span>© 2026 INCIDENT_AI</span>
        </div>
      </div>

      {/* Right Side: Form (Scrollable content but fixed container) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#FAFAFA] relative">
        <div className="absolute top-8 right-8 lg:hidden">
            <Link to="/" className="text-xs font-black uppercase tracking-widest text-black underline decoration-2">Home</Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {unverifiedEmail ? (
            <div className="bg-white border-4 border-black p-8 neo-shadow-lg">
              <div className="w-16 h-16 bg-[#FDE68A] border-2 border-black neo-shadow flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-black mb-2">Check your inbox</h1>
              <p className="text-sm font-bold text-zinc-600 mb-8 leading-snug">
                We've sent a verification link to <span className="text-black">{unverifiedEmail}</span>. Please verify your account to continue.
              </p>
              <div className="space-y-4">
                <button
                  onClick={onResend}
                  disabled={loading}
                  className="w-full bg-black text-white border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                >
                  {loading ? "SENDING..." : "RESEND EMAIL"}
                </button>
                <button
                  onClick={() => setUnverifiedEmail("")}
                  className="w-full bg-white text-black border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all"
                >
                  BACK TO LOGIN
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl font-black tracking-tighter text-black mb-2">Sign in.</h1>
                <p className="text-zinc-500 font-bold">Enter your credentials to access your workspace.</p>
              </div>

              <form onSubmit={submit} className="bg-white border-4 border-black p-8 neo-shadow-lg space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none focus:ring-0 transition-all text-sm font-bold"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                      <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none focus:ring-0 transition-all text-sm font-bold"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF6B6B] text-black border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:translate-y-1.5"
                >
                  {loading ? "SIGNING IN..." : "SIGN IN"} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t-2 border-black opacity-10"></div>
                  <span className="flex-shrink-0 mx-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest">or continue with</span>
                  <div className="flex-grow border-t-2 border-black opacity-10"></div>
                </div>

                <GoogleButton />
              </form>

              <p className="text-center text-sm font-bold text-zinc-500">
                Don't have an account?{" "}
                <Link to="/register" className="text-black underline decoration-2 underline-offset-4 hover:text-[#FF6B6B] transition-colors">
                  Create a workspace
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Security Badge (Fixed Corner) */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 neo-shadow-sm pointer-events-none">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span className="text-[10px] font-black uppercase tracking-widest">End-to-end Encrypted</span>
      </div>
    </div>
  );
}

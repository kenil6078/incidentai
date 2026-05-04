import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Mail, Lock, Key, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { handleRequestReset, handleResetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const onRequestOTP = async (e) => {
    e.preventDefault();
    try {
      await handleRequestReset(email);
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const onResetPassword = async (e) => {
    e.preventDefault();
    try {
      await handleResetPassword({ email, otp, newPassword });
      toast.success("Password reset successful!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or request failed");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-black border-2 border-black neo-shadow flex items-center justify-center">
              <span className="text-[#FF6B6B] font-black text-xs uppercase italic">i</span>
            </div>
            <span className="text-sm font-black tracking-tight text-black uppercase italic">incident.ai</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-black">Reset Password.</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={onRequestOTP}
              className="bg-white border-4 border-black p-8 neo-shadow-lg space-y-6"
            >
              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? "SENDING..." : "GET OTP"}
              </button>
              <div className="text-center">
                <Link to="/login" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Back to Login</Link>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={onResetPassword}
              className="bg-white border-4 border-black p-8 neo-shadow-lg space-y-6"
            >
              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">4-Digit OTP</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                      type="text" required maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold tracking-[1em] text-center"
                      placeholder="0000"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-black mb-1.5 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input
                      type="password" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-black focus:bg-white focus:outline-none transition-all text-sm font-bold"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF6B6B] text-black border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
              >
                {loading ? "RESETTING..." : "RESET PASSWORD"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors"
              >
                Resend OTP
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-4 border-black p-8 neo-shadow-lg text-center space-y-6"
            >
              <div className="w-16 h-16 bg-green-100 border-2 border-black neo-shadow flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-black">Success!</h2>
              <p className="text-sm font-bold text-zinc-600">Your password has been updated. You can now login with your new credentials.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-black text-white border-2 border-black py-4 text-sm font-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all"
              >
                BACK TO LOGIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

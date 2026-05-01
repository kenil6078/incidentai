import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import authService from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUnverifiedEmail("");
    try {
      const resultAction = await login({ email, password });
      const data = await resultAction.unwrap();
      toast.success("Welcome back");
      if (data.user.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err?.unverified) {
        setUnverifiedEmail(email);
        toast.error("Please verify your email first.");
      } else {
        toast.error(err?.detail || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await authService.resendVerification(unverifiedEmail);
      toast.success(res.detail || "Verification email resent!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA]">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <Link to="/" className="flex items-center gap-2 mb-12" data-testid="login-brand">
          <div className="w-7 h-7 bg-[#FF6B6B] border-2 border-black neo-shadow flex items-center justify-center">
            <span className="text-black font-black text-sm">i</span>
          </div>
          <span className="text-sm font-bold tracking-tight">incident.ai</span>
        </Link>

        {unverifiedEmail ? (
          <div className="max-w-sm w-full neo-card p-6 bg-white border-2 border-black">
            <h1 className="text-2xl font-black tracking-tighter text-zinc-950 mb-2">Check your email</h1>
            <p className="text-sm text-zinc-600 mb-6">
              You need to verify your email (<strong>{unverifiedEmail}</strong>) before you can sign in.
            </p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="w-full bg-[#FF6B6B] text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Resend Verification Email"}
            </button>
            <button
              onClick={() => setUnverifiedEmail("")}
              className="w-full mt-4 bg-white text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="max-w-sm w-full">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">/auth/login</div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2">Sign in.</h1>
            <p className="text-sm text-zinc-600 mb-8">Welcome back to your incident workspace.</p>

            <form onSubmit={submit} className="space-y-4 neo-card p-6 bg-white border-2 border-black" data-testid="login-form">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FDE68A] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="you@company.com"
                  data-testid="login-email-input"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#D4F4E4] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="••••••••"
                  data-testid="login-password-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#FF6B6B] text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="login-submit-button"
              >
                {loading ? "Signing in..." : "Sign in"} <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </form>

            <p className="mt-6 text-xs text-zinc-600">
              New here?{" "}
              <Link to="/register" className="font-semibold text-zinc-950 underline underline-offset-2" data-testid="login-go-register">
                Create a workspace
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:block bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative h-full flex flex-col justify-between p-16">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">// realtime ops</div>
          <div>
            <div className="font-mono text-xs text-green-400 mb-4">$ tail -f /var/log/incidents.log</div>
            <div className="space-y-2 font-mono text-xs">
              <div className="text-zinc-500">[14:02:11] <span className="text-amber-400">INVESTIGATING</span> API gateway 5xx</div>
              <div className="text-zinc-500">[14:03:42] <span className="text-blue-400">IDENTIFIED</span> connection pool</div>
              <div className="text-zinc-500">[14:08:30] <span className="text-indigo-400">MONITORING</span> rolled out fix</div>
              <div className="text-zinc-500">[14:14:02] <span className="text-green-400">RESOLVED</span> incident closed</div>
              <div className="text-zinc-500">[14:14:05] <span className="text-purple-400">AI</span> postmortem generated</div>
            </div>
          </div>
          <div className="text-zinc-400 text-sm max-w-md">
            "Every incident is a chance to learn. We just made the learning automatic."
          </div>
        </div>
      </div>
    </div>
  );
}

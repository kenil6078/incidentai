import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, orgName: orgName });
      setSuccess(true);
      toast.success("Registration successful!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA]">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12">
        <Link to="/" className="flex items-center gap-2 mb-12" data-testid="register-brand">
          <div className="w-7 h-7 bg-[#FF6B6B] border-2 border-black neo-shadow flex items-center justify-center">
            <span className="text-black font-black text-sm">i</span>
          </div>
          <span className="text-sm font-bold tracking-tight">incident.ai</span>
        </Link>

        {success ? (
          <div className="max-w-sm w-full neo-card p-6 bg-white border-2 border-black">
            <div className="w-12 h-12 bg-[#D4F4E4] text-black border-2 border-black neo-shadow rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-950 mb-4">Check your email</h1>
            <p className="text-sm text-zinc-600 mb-8">
              We've sent a verification link to <strong>{email}</strong>. Please click the link to verify your account before logging in.
            </p>
            <Link to="/login" className="w-full bg-[#FF6B6B] text-black border-2 border-black py-3 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="max-w-sm w-full">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">/auth/register</div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2">Create workspace.</h1>
            <p className="text-sm text-zinc-600 mb-8">You'll be the admin. Invite your team after.</p>

            <form onSubmit={submit} className="space-y-4 neo-card p-6 bg-white border-2 border-black" data-testid="register-form">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Your name</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#D4F4E4] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="Jane Doe"
                  data-testid="register-name-input"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Workspace name</label>
                <input
                  type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FFB5E8] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="Acme Corp"
                  data-testid="register-org-input"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Work email</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FDE68A] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="you@acme.com"
                  data-testid="register-email-input"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Password</label>
                <input
                  type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#E2E8F0] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="At least 6 characters"
                  data-testid="register-password-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#FF6B6B] text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="register-submit-button"
              >
                {loading ? "Creating..." : "Create workspace"} <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>
            </form>

            <p className="mt-6 text-xs text-zinc-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-zinc-950 underline underline-offset-2" data-testid="register-go-login">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>

      <div className="hidden lg:block bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative h-full flex flex-col justify-center p-16">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-6">// what you get</div>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> Multi-tenant workspace, isolated data</li>
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> Admin / Developer / Viewer roles</li>
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> Realtime incident timeline</li>
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> AI summaries, root-cause, postmortems</li>
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> Public status page out of the box</li>
            <li className="flex gap-3"><span className="text-green-400 font-mono">✓</span> Analytics: MTTR, severity breakdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

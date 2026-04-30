import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, orgName: orgName });
      toast.success(`Workspace "${orgName}" created`);
      navigate("/dashboard");
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
          <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center">
            <span className="text-white font-black text-sm">i</span>
          </div>
          <span className="text-sm font-bold tracking-tight">incident.ai</span>
        </Link>

        <div className="max-w-sm w-full">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">/auth/register</div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2">Create workspace.</h1>
          <p className="text-sm text-zinc-600 mb-8">You'll be the admin. Invite your team after.</p>

          <form onSubmit={submit} className="space-y-4" data-testid="register-form">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Your name</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                placeholder="Jane Doe"
                data-testid="register-name-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Workspace name</label>
              <input
                type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                placeholder="Acme Corp"
                data-testid="register-org-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Work email</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                placeholder="you@acme.com"
                data-testid="register-email-input"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-600 mb-1.5">Password</label>
              <input
                type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-zinc-300 focus:outline-none focus:border-zinc-950 text-sm"
                placeholder="At least 6 characters"
                data-testid="register-password-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 text-white py-2.5 text-sm font-semibold hover:bg-zinc-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              data-testid="register-submit-button"
            >
              {loading ? "Creating..." : "Create workspace"} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-xs text-zinc-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-zinc-950 underline underline-offset-2" data-testid="register-go-login">
              Sign in
            </Link>
          </p>
        </div>
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
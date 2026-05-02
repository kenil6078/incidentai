import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import * as authApi from '../services/auth.api';

export default function Register() {
  const [role, setRole] = useState("admin"); // 'admin', 'developer', 'normal_user'
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAFA]">
      <div className="flex flex-col justify-center px-8 sm:px-16 py-12 h-full overflow-y-auto">
        <Link to="/" className="flex items-center gap-2 mb-12" data-testid="register-brand">
          <div className="w-7 h-7 bg-[#FF6B6B] border-2 border-black neo-shadow flex items-center justify-center">
            <span className="text-black font-black text-sm">i</span>
          </div>
          <span className="text-sm font-bold tracking-tight">incident.ai</span>
        </Link>

        {success ? (
          <div className="max-w-sm w-full neo-card p-6 bg-white border-2 border-black">
            <div className="w-12 h-12 bg-[#D4F4E4] text-black border-2 border-black neo-shadow rounded-full flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
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
            <h1 className="text-4xl font-black tracking-tighter text-zinc-950 mb-2">Create account.</h1>
            <p className="text-sm text-zinc-600 mb-8">Join an organization or create a new one.</p>

            {/* Role Selection */}
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

            <form onSubmit={submit} className="space-y-4 neo-card p-6 bg-white border-2 border-black" data-testid="register-form">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Your name</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#D4F4E4] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="Jane Doe"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Email address</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FDE68A] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="you@acme.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-black font-bold mb-1.5">Password</label>
                <input
                  type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#E2E8F0] border-2 border-black focus:outline-none focus:bg-white text-sm neo-shadow"
                  placeholder="At least 6 characters"
                />
              </div>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#FF6B6B] text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="register-submit-button"
              >
                {loading ? "Creating..." : "Create account"} <ArrowRight className="w-4 h-4" strokeWidth={3} />
              </button>

              <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t-2 border-black"></div>
                  <span className="flex-shrink-0 mx-4 text-black text-xs font-bold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t-2 border-black"></div>
              </div>

              <a
                href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 bg-white text-black border-2 border-black py-2.5 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                Continue with Google
              </a>
            </form>

            <p className="mt-6 text-xs text-zinc-600 pb-12">
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

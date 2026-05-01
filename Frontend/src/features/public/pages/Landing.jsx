import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Brain, Globe, Activity, Shield, Users, BarChart3, CheckSquare, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import RevealText from "../../../components/RevealText";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="landing-brand">
            <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center">
              <span className="text-white font-black text-sm">i</span>
            </div>
            <span className="text-sm font-bold tracking-tight">incident.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium text-zinc-600 hover:text-zinc-950">Pricing</Link>
            <Link to="/login" className="text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5" data-testid="landing-login">Sign in</Link>
            <Link to="/register" className="bg-zinc-950 text-white text-sm font-semibold px-4 py-1.5 hover:bg-zinc-800 transition" data-testid="landing-cta-register">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative grid-bg"
      >
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-700 mb-6">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />
              all systems operational
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-950 leading-[0.95]">
              <RevealText>Incidents,</RevealText><br />
              <RevealText delay={0.2}>resolved with </RevealText><span className="italic font-light pb-1 inline-block"><RevealText delay={0.4}>intelligence</RevealText></span>.
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-6 max-w-xl text-lg text-zinc-600 leading-relaxed"
            >
              The modern operations command-center. Detect, respond and learn from every incident — with realtime collaboration, public status pages, and AI-generated postmortems baked in.
            </motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="bg-zinc-950 text-white px-5 py-3 text-sm font-semibold hover:bg-zinc-800 transition flex items-center gap-2 group"
                data-testid="hero-cta-primary"
              >
                Create your workspace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/login"
                className="border border-zinc-300 px-5 py-3 text-sm font-semibold hover:bg-white transition"
                data-testid="hero-cta-secondary"
              >
                Sign in
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-500">
              <span>JWT · Multi-tenant</span>
              <span>WebSockets · Realtime</span>
              <span>Gemini · AI</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-zinc-200 shadow-2xl">
              <div className="px-4 py-2 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-zinc-300 rounded-full" />
                  <span className="w-2 h-2 bg-zinc-300 rounded-full" />
                  <span className="w-2 h-2 bg-zinc-300 rounded-full" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">incident.ai/dashboard</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Active Incidents</div>
                  <span className="text-xs font-bold text-red-700">2 OPEN</span>
                </div>
                {[
                  { sev: "Critical", title: "API gateway returning 5xx errors", status: "Investigating", color: "bg-red-500" },
                  { sev: "High", title: "Database read latency elevated", status: "Identified", color: "bg-orange-500" },
                ].map((i, idx) => (
                  <div key={idx} className="border border-zinc-200 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 ${i.color} rounded-full pulse-dot`} />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{i.sev}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">· {i.status}</span>
                    </div>
                    <div className="text-sm font-semibold text-zinc-950">{i.title}</div>
                  </div>
                ))}
                <div className="pt-3 border-t border-zinc-200">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2">AI Summary</div>
                  <div className="text-xs text-zinc-700 leading-relaxed font-mono">
                    Two services are degraded. Probable cause: connection pool exhaustion in primary DB.
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -top-4 -right-4 w-full h-full bg-zinc-950" />
          </div>
        </div>
      </motion.section>

      <div className="border-y border-zinc-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-30 grayscale contrast-200">
            <span className="text-xl font-black tracking-tighter italic">Stripe</span>
            <span className="text-xl font-black tracking-tighter">Vercel</span>
            <span className="text-xl font-black tracking-tighter uppercase italic">Linear</span>
            <span className="text-xl font-black tracking-tighter">Segment</span>
            <span className="text-xl font-black tracking-tighter lowercase underline underline-offset-4">GitHub</span>
          </div>
        </div>
      </div>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="border-t border-zinc-200 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">Capabilities</div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 max-w-2xl">
            <RevealText>Everything your on-call rotation actually needs.</RevealText>
          </h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200">
            {[
              { icon: Zap, title: "Realtime collaboration", desc: "WebSocket-powered timelines update instantly across the org." },
              { icon: Brain, title: "AI assistant", desc: "Auto-generate summaries, root-cause hypotheses and full postmortems." },
              { icon: Globe, title: "Public status page", desc: "A reassuring, branded page for your customers — no extra setup." },
              { icon: Activity, title: "Service health", desc: "Track operational state of every service and subsystem you run." },
              { icon: Users, title: "Team & roles", desc: "Admin, Developer, Viewer. Invite teammates. Assign incidents." },
              { icon: Shield, title: "Multi-tenant", desc: "Each workspace is fully isolated. Your data, your team." },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 hover:bg-zinc-50 transition">
                <f.icon className="w-5 h-5 text-zinc-950 mb-4" strokeWidth={1.5} />
                <div className="text-base font-bold text-zinc-950 mb-1">{f.title}</div>
                <div className="text-sm text-zinc-600 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-zinc-50 border-t border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Intelligence at core</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 leading-[1.1]">
              Detect, analyze, and <br/><span className="text-zinc-400">solve in seconds.</span>
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-lg">
              Our AI assistant doesn't just summarize. It identifies patterns across your logs, metrics, and past incidents to suggest immediate root causes and remediation steps.
            </p>
            <ul className="space-y-4">
              {[
                { icon: Brain, t: "Contextual Analysis", d: "Reads through your timeline and technical logs." },
                { icon: MessageSquare, t: "Natural Language Reports", d: "Drafts summaries for stakeholders automatically." },
                { icon: CheckSquare, t: "Actionable Hypotheses", d: "Suggests the most likely failure points." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="mt-1 w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-zinc-950" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-950">{item.t}</div>
                    <div className="text-xs text-zinc-500">{item.d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="bg-zinc-950 p-1 lg:rotate-2 shadow-2xl">
              <div className="bg-white border border-zinc-200 p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">AI Postmortem Draft</span>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-zinc-100 w-3/4 rounded animate-pulse" />
                  <div className="h-4 bg-zinc-100 w-full rounded animate-pulse" />
                  <div className="h-4 bg-zinc-100 w-5/6 rounded animate-pulse" />
                  <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4">
                    <div className="h-8 bg-zinc-950 rounded" />
                    <div className="h-8 bg-zinc-100 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white border-t border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-12">
          <div className="space-y-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">Transparency</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950">
              <RevealText>Build trust with every status update.</RevealText>
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              Automated status pages that keep your customers in the loop, while your team stays focused on the fix. Close the loop with detailed postmortems that demonstrate reliability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Public Status", desc: "Custom domains, branded layouts, and automated alerts for customers." },
              { icon: CheckSquare, title: "Verified Reports", desc: "Data-backed postmortems that identify clear prevention strategies." },
              { icon: BarChart3, title: "Reliability Metrics", desc: "Track MTTR, MTBF, and uptime across your entire organization." }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-zinc-200 hover:border-zinc-950 transition-all text-left group">
                <item.icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-950 transition-colors mb-6" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-zinc-950 mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter">Stop firefighting alone.</h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto">Spin up your workspace in under 30 seconds. No credit card required.</p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition"
            data-testid="footer-cta-register"
          >
            Get started — it's free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs font-mono text-zinc-500 flex justify-between">
          <div className="flex gap-4">
            <span>© 2026 incident.ai</span>
            <Link to="/pricing" className="hover:text-zinc-950 transition-colors">Pricing</Link>
            <Link to="/status/demo" className="hover:text-zinc-950 transition-colors">Demo Status</Link>
          </div>
          <span>built for SRE teams who care</span>
        </div>
      </footer>
    </div>
  );
}

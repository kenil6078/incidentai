import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Brain, Globe, Activity, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import RevealText from "../../../components/RevealText";
import { useAuth } from "../../auth/hooks/useAuth";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function Landing() {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/login";
    return user.role === 'super_admin' ? "/admin" : "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PublicNavbar />

      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative grid-bg py-20"
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border-2 border-black bg-[#D4F4E4] px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-black font-bold neo-shadow mb-8">
              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              all systems operational
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[0.9]">
              <RevealText>Incidents,</RevealText><br />
              <RevealText delay={0.2}>solved with </RevealText><span className="italic font-light text-[#FF6B6B]"><RevealText delay={0.4}>intelligence</RevealText></span>.
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 max-w-xl text-xl text-zinc-700 leading-tight font-medium"
            >
              The modern operations command-center. Detect, respond and learn from every incident — with realtime collaboration, status pages, and AI postmortems.
            </motion.p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {user ? (
                <Link
                  to={getDashboardLink()}
                  className="bg-[#FF6B6B] text-black px-10 py-5 text-xl font-black border-4 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 group"
                  data-testid="hero-dashboard-primary"
                >
                  Go to Dashboard
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition" strokeWidth={3} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-[#FF6B6B] text-black px-8 py-4 text-lg font-black border-4 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-3 group"
                    data-testid="hero-cta-primary"
                  >
                    Create workspace
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" strokeWidth={3} />
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-black px-8 py-4 text-lg font-black border-4 border-black neo-shadow hover:translate-y-1 hover:shadow-none transition-all"
                    data-testid="hero-cta-secondary"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 2 }}
              transition={{ delay: 0.4 }}
              className="bg-white border-4 border-black neo-shadow-lg p-1 relative z-10"
            >
              <div className="px-4 py-3 border-b-4 border-black bg-[#FDE68A] flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="w-3 h-3 border-2 border-black rounded-full bg-[#FF6B6B]" />
                  <span className="w-3 h-3 border-2 border-black rounded-full bg-white" />
                  <span className="w-3 h-3 border-2 border-black rounded-full bg-[#D4F4E4]" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-black font-bold">incident.ai/dashboard</span>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black font-black">Active Incidents</div>
                  <span className="text-xs font-black bg-red-100 text-red-600 px-2 py-0.5 border-2 border-red-600">2 OPEN</span>
                </div>
                {[
                  { sev: "Critical", title: "API gateway returning 5xx errors", status: "Investigating", color: "bg-[#FF6B6B]", cardColor: "bg-red-50" },
                  { sev: "High", title: "Database latency elevated", status: "Identified", color: "bg-[#FDE68A]", cardColor: "bg-yellow-50" },
                ].map((i, idx) => (
                  <div key={idx} className={`${i.cardColor} border-2 border-black p-4 neo-shadow-sm`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 ${i.color} border border-black rounded-full`} />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-black font-black">{i.sev}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">· {i.status}</span>
                    </div>
                    <div className="text-sm font-black text-black">{i.title}</div>
                  </div>
                ))}
                <div className="pt-4 border-t-2 border-black">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-black font-black mb-2">AI Summary</div>
                  <div className="text-xs text-zinc-800 leading-tight font-bold bg-zinc-50 p-3 border-2 border-black">
                    Probable cause: connection pool exhaustion in primary DB. AI suggests scaling replicas.
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FDE68A] border-4 border-black neo-shadow -z-0" />
          </div>
        </div>
      </motion.section>

      <section className="bg-[#FDE68A] border-t-4 border-black py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Reduction in MTTR", value: "32%", detail: "Mean Time To Resolve" },
              { label: "Success Rate", value: "99.9%", detail: "SLA Adherence" },
              { label: "AI Accuracy", value: "94%", detail: "Root Cause Detection" },
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-4 border-black p-6 neo-shadow text-center"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">{s.label}</div>
                <div className="text-4xl font-black text-black tracking-tight mb-1">{s.value}</div>
                <div className="text-xs font-bold text-zinc-600 uppercase">{s.detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">Capabilities</div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-black max-w-2xl leading-none mb-12 uppercase italic">
            <RevealText>Everything your on-call rotation actually needs.</RevealText>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Realtime collaboration", desc: "WebSocket-powered timelines update instantly across the org.", color: "bg-[#D4F4E4]" },
              { icon: Brain, title: "AI assistant", desc: "Auto-generate summaries, root-cause hypotheses and full postmortems.", color: "bg-[#FDE68A]" },
              { icon: Globe, title: "Public status page", desc: "A reassuring, branded page for your customers — no extra setup.", color: "bg-[#FF6B6B]" },
              { icon: Activity, title: "Service health", desc: "Track operational state of every service and subsystem you run.", color: "bg-[#FFB5E8]" },
              { icon: Users, title: "Team & roles", desc: "Admin, Developer, Viewer. Invite teammates. Assign incidents.", color: "bg-[#E2E8F0]" },
              { icon: Shield, title: "Multi-tenant", desc: "Each workspace is fully isolated. Your data, your team.", color: "bg-[#C084FC]" },
            ].map((f, i) => (
              <div key={i} className={`${f.color} border-4 border-black p-8 neo-shadow hover:translate-y-1 hover:shadow-none transition-all group`}>
                <f.icon className="w-8 h-8 text-black mb-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <div className="text-2xl font-black text-black mb-3 uppercase italic">{f.title}</div>
                <div className="text-base font-bold text-black/70 leading-snug">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-t-4 border-black py-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">Workflow</div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black leading-none uppercase italic">
                <RevealText>From  detection  to  postmortem.</RevealText>
              </h2>
            </div>
            <div className="text-sm font-bold text-zinc-600 max-w-xs">
              A structured, opinionated flow that forces high-quality incident management.
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Declare", desc: "Instantly create a dedicated incident channel and invite the right people.", color: "bg-[#FF6B6B]" },
              { step: "02", title: "Coordinate", desc: "Use realtime timelines to track progress, assign roles, and share updates.", color: "bg-[#FDE68A]" },
              { step: "03", title: "Retrospect", desc: "Auto-generate AI postmortems and track action items to closure.", color: "bg-[#D4F4E4]" },
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`text-6xl font-black ${s.color} text-black border-4 border-black inline-block px-4 py-2 neo-shadow mb-6`}>
                  {s.step}
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase italic">{s.title}</h3>
                <p className="text-base font-bold text-zinc-700">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-10 -right-8">
                    <ArrowRight className="w-8 h-8 text-black" strokeWidth={3} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#D4F4E4] border-t-4 border-black py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
             <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">Engineered Excellence</div>
             <h2 className="text-3xl md:text-5xl font-black tracking-tight text-black uppercase italic">The Builders.</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { quote: "Building an interface that feels alive while staying rigid with Neubrutalism was the ultimate challenge. It's built for speed and precision.", author: "Kenil Bhuva", role: "Frontend Developer" },
              { quote: "The core is architected for extreme reliability and real-time synchronization. Every incident lifecycle is backed by a robust, scalable engine.", author: "Ashok Kumar", role: "Backend Developer" },
              { quote: "Infrastructure as code, automated pipelines, and deep observability. We ensure your command center is always online, no matter the scale.", author: "Subham Dhar", role: "DevOps Engineer" },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border-4 border-black p-8 neo-shadow flex flex-col justify-between"
              >
                <div className="text-lg font-black text-black leading-tight mb-6">"{t.quote}"</div>
                <div>
                  <div className="text-sm font-mono font-bold text-zinc-500 uppercase tracking-widest mb-1">{t.role}</div>
                  <div className="text-2xl font-black text-black uppercase italic">{t.author}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-8 leading-none uppercase italic">Stop firefighting alone.</h2>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto font-bold mb-12">Spin up your workspace in under 30 seconds. No credit card required.</p>
          {user ? (
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center gap-3 bg-[#FF6B6B] text-black px-10 py-5 text-xl font-black border-4 border-black neo-shadow hover:bg-white transition-all group"
              data-testid="footer-dashboard"
            >
              Go to Dashboard
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" strokeWidth={3} />
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-[#FF6B6B] text-black px-10 py-5 text-xl font-black border-4 border-black neo-shadow hover:bg-white transition-all group"
              data-testid="footer-cta-register"
            >
              Get started — it's free 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" strokeWidth={3} />
            </Link>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

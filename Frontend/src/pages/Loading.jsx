
Action: file_editor create /app/frontend/src/pages/Landing.jsx --file-text "import React from \"react\";
import { Link } from \"react-router-dom\";
import { ArrowRight, Zap, Brain, Globe, Activity, Shield, Users } from \"lucide-react\";

export default function Landing() {
  return (
    <div className=\"min-h-screen bg-[#FAFAFA]\">
      {/* Nav */}
      <nav className=\"border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-30\">
        <div className=\"max-w-7xl mx-auto px-6 h-14 flex items-center justify-between\">
          <Link to=\"/\" className=\"flex items-center gap-2\" data-testid=\"landing-brand\">
            <div className=\"w-7 h-7 bg-zinc-950 flex items-center justify-center\">
              <span className=\"text-white font-black text-sm\">i</span>
            </div>
            <span className=\"text-sm font-bold tracking-tight\">incident.ai</span>
          </Link>
          <div className=\"flex items-center gap-2\">
            <Link to=\"/login\" className=\"text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5\" data-testid=\"landing-login\">Sign in</Link>
            <Link to=\"/register\" className=\"bg-zinc-950 text-white text-sm font-semibold px-4 py-1.5 hover:bg-zinc-800 transition\" data-testid=\"landing-cta-register\">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className=\"relative grid-bg\">
        <div className=\"max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12 items-center\">
          <div className=\"lg:col-span-7\">
            <div className=\"inline-flex items-center gap-2 border border-zinc-300 bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-700 mb-6\">
              <span className=\"w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot\" />
              all systems operational
            </div>
            <h1 className=\"text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-zinc-950 leading-[0.95]\">
              Incidents,<br />resolved with <span className=\"italic font-light\">intelligence</span>.
            </h1>
            <p className=\"mt-6 max-w-xl text-lg text-zinc-600 leading-relaxed\">
              The modern operations command-center. Detect, respond and learn from every incident — with realtime collaboration, public status pages, and AI-generated postmortems baked in.
            </p>
            <div className=\"mt-8 flex flex-wrap items-center gap-3\">
              <Link
                to=\"/register\"
                className=\"bg-zinc-950 text-white px-5 py-3 text-sm font-semibold hover:bg-zinc-800 transition flex items-center gap-2 group\"
                data-testid=\"hero-cta-primary\"
              >
                Create your workspace
                <ArrowRight className=\"w-4 h-4 group-hover:translate-x-1 transition\" />
              </Link>
              <Link
                to=\"/login\"
                className=\"border border-zinc-300 px-5 py-3 text-sm font-semibold hover:bg-white transition\"
                data-testid=\"hero-cta-secondary\"
              >
                Sign in
              </Link>
            </div>
            <div className=\"mt-10 flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-zinc-500\">
              <span>JWT · Multi-tenant</span>
              <span>WebSockets · Realtime</span>
              <span>Gemini · AI</span>
            </div>
          </div>

          {/* Mock dashboard card */}
          <div className=\"lg:col-span-5 relative\">
            <div className=\"bg-white border border-zinc-200 shadow-2xl\">
              <div className=\"px-4 py-2 border-b border-zinc-200 flex items-center justify-between\">
                <div className=\"flex gap-1.5\">
                  <span className=\"w-2 h-2 bg-zinc-300 rounded-full\" />
                  <span className=\"w-2 h-2 bg-zinc-300 rounded-full\" />
                  <span className=\"w-2 h-2 bg-zinc-300 rounded-full\" />
                </div>
                <span className=\"text-[10px] font-mono uppercase tracking-wider text-zinc-500\">incident.ai/dashboard</span>
              </div>
              <div className=\"p-5 space-y-4\">
                <div className=\"flex items-center justify-between\">
                  <div className=\"text-xs font-mono uppercase tracking-[0.2em] text-zinc-500\">Active Incidents</div>
                  <span className=\"text-xs font-bold text-red-700\">2 OPEN</span>
                </div>
                {[
                  { sev: \"Critical\", title: \"API gateway returning 5xx errors\", status: \"Investigating\", color: \"bg-red-500\" },
                  { sev: \"High\", title: \"Database read latency elevated\", status: \"Identified\", color: \"bg-orange-500\" },
                ].map((i, idx) => (
                  <div key={idx} className=\"border border-zinc-200 p-3\">
                    <div className=\"flex items-center gap-2 mb-1\">
                      <span className={`w-1.5 h-1.5 ${i.color} rounded-full pulse-dot`} />
                      <span className=\"text-[10px] font-mono uppercase tracking-wider text-zinc-500\">{i.sev}</span>
                      <span className=\"text-[10px] font-mono uppercase tracking-wider text-zinc-400\">· {i.status}</span>
                    </div>
                    <div className=\"text-sm font-semibold text-zinc-950\">{i.title}</div>
                  </div>
                ))}
                <div className=\"pt-3 border-t border-zinc-200\">
                  <div className=\"text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-2\">AI Summary</div>
                  <div className=\"text-xs text-zinc-700 leading-relaxed font-mono\">
                    Two services are degraded. Probable cause: connection pool exhaustion in primary DB.
                  </div>
                </div>
              </div>
            </div>
            <div className=\"absolute -z-10 -top-4 -right-4 w-full h-full bg-zinc-950\" />
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className=\"border-t border-zinc-200 bg-white\">
        <div className=\"max-w-7xl mx-auto px-6 py-20\">
          <div className=\"text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3\">Capabilities</div>
          <h2 className=\"text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 max-w-2xl\">
            Everything your on-call rotation actually needs.
          </h2>
          <div className=\"mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 border border-zinc-200\">
            {[
              { icon: Zap, title: \"Realtime collaboration\", desc: \"WebSocket-powered timelines update instantly across the org.\" },
              { icon: Brain, title: \"AI assistant\", desc: \"Auto-generate summaries, root-cause hypotheses and full postmortems.\" },
              { icon: Globe, title: \"Public status page\", desc: \"A reassuring, branded page for your customers — no extra setup.\" },
              { icon: Activity, title: \"Service health\", desc: \"Track operational state of every service and subsystem you run.\" },
              { icon: Users, title: \"Team & roles\", desc: \"Admin, Developer, Viewer. Invite teammates. Assign incidents.\" },
              { icon: Shield, title: \"Multi-tenant\", desc: \"Each workspace is fully isolated. Your data, your team.\" },
            ].map((f, i) => (
              <div key={i} className=\"bg-white p-6 hover:bg-zinc-50 transition\">
                <f.icon className=\"w-5 h-5 text-zinc-950 mb-4\" strokeWidth={1.5} />
                <div className=\"text-base font-bold text-zinc-950 mb-1\">{f.title}</div>
                <div className=\"text-sm text-zinc-600 leading-relaxed\">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className=\"bg-zinc-950 text-white\">
        <div className=\"max-w-7xl mx-auto px-6 py-20 text-center\">
          <h2 className=\"text-4xl sm:text-5xl font-black tracking-tighter\">Stop firefighting alone.</h2>
          <p className=\"mt-4 text-zinc-400 max-w-xl mx-auto\">Spin up your workspace in under 30 seconds. No credit card required.</p>
          <Link
            to=\"/register\"
            className=\"mt-8 inline-flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition\"
            data-testid=\"footer-cta-register\"
          >
            Get started — it's free <ArrowRight className=\"w-4 h-4\" />
          </Link>
        </div>
      </section>

      <footer className=\"border-t border-zinc-200 bg-white\">
        <div className=\"max-w-7xl mx-auto px-6 py-6 text-xs font-mono text-zinc-500 flex justify-between\">
          <span>© 2026 incident.ai</span>
          <span>built for SRE teams who care</span>
        </div>
      </footer>
    </div>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Landing.jsx
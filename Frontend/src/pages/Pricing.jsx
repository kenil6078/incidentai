import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RevealText from "../components/RevealText";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      desc: "For small teams getting started with incident management.",
      features: ["5 Teammates", "Public Status Page", "Realtime Timeline", "Standard Support"],
      cta: "Get started for free",
      highlight: false
    },
    {
      name: "Pro",
      price: "₹4,499",
      desc: "Everything in Starter plus advanced AI and deeper analytics.",
      features: ["Unlimited Teammates", "AI Assistant (Gemini)", "Advanced Analytics", "Custom Domain Status Page", "Priority Support"],
      cta: "Start 14-day trial",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Built for massive organizations with complex compliance needs.",
      features: ["Single Sign-On (SSO)", "Audit Logs", "SLA Guarantees", "Dedicated Success Manager", "24/7 Phone Support"],
      cta: "Contact sales",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center">
              <span className="text-white font-black text-sm">i</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-zinc-950">incident.ai</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">Sign in</Link>
            <Link to="/register" className="bg-zinc-950 text-white text-sm font-semibold px-4 py-1.5 hover:bg-zinc-800 transition">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">Simple pricing</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-zinc-950 mb-6 leading-[1.1]">
          <RevealText>Invest in your </RevealText><br/><span className="italic font-light"><RevealText delay={0.2}>reliability</RevealText></span>.
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-lg text-zinc-600 max-w-2xl mx-auto mb-16"
        >
          Whether you're a two-person startup or a global enterprise, we have a plan that fits your engineering team's needs.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 border ${plan.highlight ? 'border-zinc-950 bg-white shadow-2xl scale-105 z-10' : 'border-zinc-200 bg-white'} text-left flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-black tracking-tight text-zinc-950 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter text-zinc-950">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-sm text-zinc-500 font-medium">/month</span>}
                </div>
                <p className="mt-4 text-sm text-zinc-500 leading-relaxed">{plan.desc}</p>
              </div>
              
              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-zinc-950 mt-0.5 shrink-0" />
                    <span className="text-sm text-zinc-700">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className={`w-full py-3 text-center text-sm font-semibold transition ${plan.highlight ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-zinc-50 text-zinc-950 border border-zinc-200 hover:bg-zinc-100'}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-zinc-950 text-white text-left grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tighter mb-4">Questions? We're here to help.</h2>
            <p className="text-zinc-400 text-sm">Our team of SRE experts is ready to help you optimize your incident response workflow.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button className="bg-white text-zinc-950 px-6 py-3 text-sm font-semibold hover:bg-zinc-200 transition flex items-center gap-2">
              Chat with an expert <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-xs font-mono text-zinc-500 flex justify-between">
          <span>© 2026 incident.ai</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-zinc-950">Home</Link>
            <Link to="/status/demo" className="hover:text-zinc-950">Status Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

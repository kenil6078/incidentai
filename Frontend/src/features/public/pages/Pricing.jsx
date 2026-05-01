import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RevealText from "../../../components/RevealText";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "₹0",
      desc: "For small teams getting started with incident management.",
      features: ["5 Teammates", "Public Status Page", "Realtime Timeline", "Standard Support"],
      cta: "Get started for free",
      highlight: false,
      color: "bg-[#D4F4E4]"
    },
    {
      name: "Pro",
      price: "₹4,499",
      desc: "Everything in Starter plus advanced AI and deeper analytics.",
      features: ["Unlimited Teammates", "AI Assistant (Gemini)", "Advanced Analytics", "Custom Domain Status Page", "Priority Support"],
      cta: "Start 14-day trial",
      highlight: true,
      color: "bg-[#FDE68A]"
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Built for massive organizations with complex compliance needs.",
      features: ["Single Sign-On (SSO)", "Audit Logs", "SLA Guarantees", "Dedicated Success Manager", "24/7 Phone Support"],
      cta: "Contact sales",
      highlight: false,
      color: "bg-[#FFB5E8]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <nav className="border-b-2 border-black bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B6B] border-2 border-black neo-shadow flex items-center justify-center">
              <span className="text-black font-black text-sm">i</span>
            </div>
            <span className="text-lg font-black tracking-tight text-black">incident.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-black hover:underline decoration-2">Sign in</Link>
            <Link to="/register" className="bg-[#FF6B6B] text-black text-sm font-bold px-6 py-2 border-2 border-black neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all">
              Start free
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4 font-bold">Simple pricing</div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black mb-8 leading-none">
          <RevealText>Invest in your </RevealText><br/><span className="italic font-light text-[#FF6B6B]"><RevealText delay={0.2}>reliability</RevealText></span>.
        </h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-xl text-zinc-700 max-w-2xl mx-auto mb-16 font-medium"
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
              className={`relative p-8 border-4 border-black neo-shadow ${plan.color} text-left flex flex-col hover:translate-y-1 hover:shadow-none transition-all`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-mono uppercase tracking-widest px-4 py-1 border-2 border-black">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-3xl font-black tracking-tighter text-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-black">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-sm text-black/60 font-bold">/month</span>}
                </div>
                <p className="mt-4 text-base font-bold text-black/70 leading-tight">{plan.desc}</p>
              </div>
              
              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-black mt-0.5 shrink-0" strokeWidth={3} />
                    <span className="text-sm font-bold text-black">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className={`w-full py-4 text-center text-lg font-black border-4 border-black neo-shadow transition-all hover:translate-y-0.5 hover:shadow-none ${plan.highlight ? 'bg-black text-white' : 'bg-white text-black'}`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 p-12 bg-black text-white text-left grid lg:grid-cols-2 gap-12 items-center border-4 border-black neo-shadow">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">Questions? We're here to help.</h2>
            <p className="text-zinc-400 text-lg font-bold">Our team of SRE experts is ready to help you optimize your incident response workflow.</p>
          </div>
          <div className="flex justify-start lg:justify-end">
            <button className="bg-[#FF6B6B] text-black px-8 py-4 text-lg font-black border-4 border-black neo-shadow hover:bg-white transition-all flex items-center gap-3 group">
              Chat with an expert <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t-4 border-black bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-sm font-black text-black flex justify-between">
          <span>© 2026 incident.ai</span>
          <div className="flex gap-8">
            <Link to="/" className="hover:underline decoration-2">Home</Link>
            <Link to="/status/demo" className="hover:underline decoration-2">Status Page</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

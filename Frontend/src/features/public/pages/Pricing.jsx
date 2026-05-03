import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import RevealText from "../../../components/RevealText";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("yearly");

  const plans = [
    {
      name: "Starter",
      tagline: "Ideal for small technical teams.",
      price: { monthly: "₹0", yearly: "₹0" },
      features: [
        "5 Incident Creations",
        "Public Status Page",
        "Realtime Timeline",
        "Standard Analytics",
        "Basic AI Support"
      ],
      cta: "Initialize for Free",
      color: "bg-[#D4F4E4]",
    },
    {
      name: "Professional",
      tagline: "For teams scaling reliability.",
      price: { monthly: "₹499", yearly: "₹4,499" },
      features: [
        "Unlimited Incidents",
        "Gemini 1.5 Pro AI Support",
        "Advanced Postmortems",
        "Custom Domain Status Page",
        "Priority 24/7 Support",
        "Team RBAC Controls"
      ],
      cta: "Go Professional",
      highlight: true,
      color: "bg-[#FF6B6B]",
    },
    {
      name: "Enterprise",
      tagline: "Maximum security and compliance.",
      price: { monthly: "Custom", yearly: "Custom" },
      features: [
        "SAML / Single Sign-On (SSO)",
        "Advanced Audit Logging",
        "White-glove Onboarding",
        "SLA Guarantees",
        "Dedicated Success Manager",
        "Direct Engineering Slack"
      ],
      cta: "Contact Sales",
      color: "bg-[#FDE68A]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-outfit selection:bg-black selection:text-white">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-6"
        >
          Economic Infrastructure
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-black mb-12 leading-none uppercase italic">
          <RevealText>Investment in </RevealText>
          <br />
          <span className="text-[#FF6B6B]">
            <RevealText delay={0.2}>Reliability.</RevealText>
          </span>
        </h1>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-20">
          <div className="flex p-1 bg-zinc-200 border-4 border-black neo-shadow-sm">
            {["monthly", "yearly"].map((cycle) => (
              <button 
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  billingCycle === cycle 
                    ? "bg-black text-white neo-shadow-sm -m-[2px] z-10" 
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {cycle} {cycle === "yearly" && <span className="text-[#FF6B6B] ml-1">(Save 25%)</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-10 border-4 border-black text-left flex flex-col transition-all group ${
                plan.highlight ? "bg-white neo-shadow-lg scale-105 z-10" : "bg-white neo-shadow"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-10 bg-[#FF6B6B] text-black text-[10px] font-black uppercase tracking-widest px-4 py-2 border-4 border-black neo-shadow-sm">
                  Recommended
                </div>
              )}
              
              <div className="mb-10">
                <div className={`w-12 h-12 ${plan.color} border-2 border-black mb-6 flex items-center justify-center neo-shadow-sm`}>
                  {plan.highlight ? <Zap className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-black uppercase italic mb-2">
                  {plan.name}
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-10 p-6 bg-zinc-50 border-2 border-black/10 group-hover:border-black transition-colors">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight text-black font-mono italic">
                    {typeof plan.price === 'string' ? plan.price : plan.price[billingCycle]}
                  </span>
                  {typeof plan.price !== 'string' && plan.price.monthly !== "₹0" && (
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                      / {billingCycle}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-5 mb-12 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-4 group/item">
                    <div className="w-5 h-5 bg-[#D4F4E4] border-2 border-black flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-black" strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover/item:text-black transition-colors">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className={`w-full py-5 text-center text-sm font-black uppercase tracking-widest border-4 border-black neo-shadow transition-all hover:translate-y-0.5 hover:shadow-none ${
                  plan.highlight ? "bg-[#FF6B6B] text-black" : "bg-white text-black hover:bg-zinc-50"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}

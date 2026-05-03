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

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-zinc-400 mb-8 font-black"
        >
          Economic Infrastructure
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tight text-black mb-16 leading-[0.85] uppercase italic">
          <RevealText>Investment in </RevealText>
          <br />
          <span className="text-[#FF6B6B]">
            <RevealText delay={0.2}>Reliability.</RevealText>
          </span>
        </h1>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-6 mb-24">
          <div className="flex p-1.5 bg-zinc-200 border-4 border-black neo-shadow-sm">
            {["monthly", "yearly"].map((cycle) => (
              <button 
                key={cycle}
                onClick={() => setBillingCycle(cycle)}
                className={`px-10 py-3 text-[10px] md:text-xs font-mono font-black uppercase tracking-widest transition-all ${
                  billingCycle === cycle 
                    ? "bg-black text-white neo-shadow-sm -m-[2px] z-10" 
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {cycle} {cycle === "yearly" && <span className="text-[#FF6B6B] ml-2 font-black">(Save 25%)</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-12">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-10 lg:p-12 border-4 border-black text-left flex flex-col transition-all group ${
                plan.highlight ? "bg-white neo-shadow-lg scale-105 z-10" : "bg-white neo-shadow"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-5 left-10 bg-[#FF6B6B] text-black text-[10px] font-mono font-black uppercase tracking-widest px-4 py-2 border-4 border-black neo-shadow-sm">
                  Recommended
                </div>
              )}
              
              <div className="mb-12">
                <div className={`w-14 h-14 ${plan.color} border-4 border-black mb-8 flex items-center justify-center neo-shadow-sm group-hover:-rotate-6 transition-transform`}>
                  {plan.highlight ? <Zap className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                </div>
                <h3 className="text-3xl font-black tracking-tight text-black uppercase italic mb-3 leading-none">
                  {plan.name}
                </h3>
                <p className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest leading-tight">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-12 p-8 bg-zinc-50 border-4 border-black/10 group-hover:border-black transition-colors min-h-[140px] flex items-center">
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className={`${(typeof plan.price === 'string' ? plan.price : plan.price[billingCycle]) === 'Custom' ? 'text-4xl lg:text-5xl' : 'text-5xl lg:text-6xl'} font-black tracking-tight text-black font-mono italic leading-none`}>
                      {typeof plan.price === 'string' ? plan.price : plan.price[billingCycle]}
                    </span>
                    {typeof plan.price !== 'string' && plan.price.monthly !== "₹0" && (
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-400">
                        / {billingCycle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-16 flex-1">
                {plan.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-4 group/item">
                    <div className="w-6 h-6 bg-[#D4F4E4] border-2 border-black flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-black" strokeWidth={4} />
                    </div>
                    <span className="text-xs font-mono font-black uppercase tracking-widest text-zinc-600 group-hover/item:text-black transition-colors">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className={`w-full py-6 text-center text-sm font-mono font-black uppercase tracking-widest border-4 border-black neo-shadow transition-all hover:translate-y-1 hover:shadow-none ${
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

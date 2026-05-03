import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CreditCard, Check, Zap, ArrowRight, Loader2, History, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { fetchBillingInfo, createOrder, verifyPayment, fetchTransactions, selectBilling, selectTransactions } from "../billing.slice";

export default function Billing() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { plan, incidentCount, limit } = useSelector(selectBilling);
  const transactions = useSelector(selectTransactions) || [];
  const [localLoading, setLocalLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState("yearly");

  useEffect(() => {
    dispatch(fetchBillingInfo());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: { monthly: "₹0", yearly: "₹0" },
      amount: { monthly: 0, yearly: 0 },
      features: ["5 Incident Creations", "AI Assistant (Minimal)", "Basic Analytics", "Public Status Page"]
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: "₹499", yearly: "₹4,499" },
      amount: { monthly: 499, yearly: 4499 },
      features: ["Unlimited Incidents", "Gemini 1.5 Pro AI", "Advanced Postmortems", "Team Management", "Priority Support"]
    }
  ];

  const handleUpgrade = async (selectedPlan) => {
    if (selectedPlan.id === plan) {
      toast.info(`Already on ${selectedPlan.name}`);
      return;
    }
    if (selectedPlan.amount[billingCycle] === 0) {
      toast.info("Switching to free is manual.");
      return;
    }

    setLocalLoading(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = async () => {
      try {
        const order = await dispatch(createOrder({ planId: selectedPlan.id, billingCycle })).unwrap();
        const options = {
          key: order.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "incident.ai",
          description: `${selectedPlan.name} (${billingCycle})`,
          order_id: order.id,
          handler: async (res) => {
            await dispatch(verifyPayment(res)).unwrap();
            toast.success("Upgraded!");
            dispatch(fetchBillingInfo());
            dispatch(fetchTransactions());
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: "#000000" },
        };
        new window.Razorpay(options).open();
      } catch (err) {
        toast.error("Payment failed");
      } finally {
        setLocalLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 selection:bg-black selection:text-white relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase italic">Billing & Subscription</h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-tight">Manage your workspace economics.</p>
        </div>
        <div className="flex p-1 bg-zinc-100 border-2 border-black neo-shadow-sm">
          {["monthly", "yearly"].map((cycle) => (
            <button 
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                billingCycle === cycle ? "bg-black text-white neo-shadow-sm -m-[1px] z-10" : "text-zinc-500"
              }`}
            >
              {cycle} {cycle === "yearly" && <span className="text-[#FF6B6B]">-25%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border-2 border-black p-5 flex flex-col md:flex-row items-center justify-between gap-6 neo-shadow">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${plan === 'pro' ? 'bg-[#FF6B6B]' : 'bg-black'} border-2 border-black flex items-center justify-center neo-shadow-sm shrink-0`}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-zinc-400">Current Plan</div>
            <div className="text-xl font-black uppercase italic">{plan ? plan : "FREE"}</div>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <div className="text-[10px] font-black uppercase text-zinc-400">Incidents Usage</div>
            <div className="text-sm font-black font-mono">{incidentCount} / {plan === 'pro' ? "∞" : limit}</div>
            <div className="w-32 h-2 border-2 border-black bg-zinc-50 mt-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((incidentCount / (plan === 'pro' ? 1 : limit)) * (plan === 'pro' ? 0 : 100), 100)}%` }}
                className="h-full bg-black"
              />
            </div>
          </div>
          <div className="hidden sm:block border-l-2 border-black/5 h-10" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verified</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div 
            key={p.id}
            className={`p-6 border-2 border-black flex flex-col relative transition-all ${
              p.id === plan ? "bg-zinc-50/50 opacity-60" : "bg-white neo-shadow hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            {p.id === "pro" && <span className="absolute -top-3 right-6 bg-black text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] neo-shadow-sm">Best Value</span>}
            <div className="mb-6">
              <h3 className="text-xl font-black uppercase italic">{p.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black font-mono italic">{p.price[billingCycle]}</span>
                <span className="text-[10px] font-black uppercase text-zinc-400">/ {billingCycle}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#D4F4E4] border-2 border-black flex items-center justify-center shrink-0">
                    <Check className="w-2 h-2 text-black" strokeWidth={5} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(p)}
              disabled={localLoading || p.id === plan || (p.id === 'free' && (!plan || plan === 'free'))}
              className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-2 border-black transition-all ${
                p.id === "pro" ? "bg-[#FF6B6B] neo-shadow hover:translate-y-0.5 hover:shadow-none" : "bg-white hover:bg-zinc-50"
              } disabled:opacity-50`}
            >
              {localLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 
               (p.id === plan) ? "Active Engine" : `Upgrade to ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
          <History className="w-5 h-5" /> Ledger History
        </h3>
        <div className="bg-white border-2 border-black neo-shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-black bg-zinc-50 text-[8px] font-black uppercase tracking-widest text-zinc-400">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Value</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black/5">
              {transactions.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">No records found.</td></tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t._id} className="text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-500">{t.razorpayOrderId}</td>
                    <td className="px-6 py-4 italic">₹{t.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 border-2 border-black text-[8px] bg-[#D4F4E4]">{t.status}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400 font-mono">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

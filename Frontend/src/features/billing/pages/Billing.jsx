import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Check, Zap, ArrowRight, Loader2, ShieldCheck, History } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../auth/hooks/useAuth";
import { fetchBillingInfo, createOrder, verifyPayment, selectBilling } from "../billing.slice";

export default function Billing() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { plan, incidentCount, limit, loading, orderLoading, verifying } = useSelector(selectBilling);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchBillingInfo());
  }, [dispatch]);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "₹0",
      amount: 0,
      features: ["5 Teammates", "Public Status Page", "Realtime Timeline", "Community Support"]
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹4,499",
      amount: 4499,
      features: ["Unlimited Teammates", "AI Assistant (Gemini 1.5)", "Advanced Analytics", "Custom Domains", "Priority Support"]
    }
  ];

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (selectedPlan) => {
    if (selectedPlan.id === plan || (selectedPlan.id === 'starter' && plan === 'free')) {
      toast.info(`You are already on the ${selectedPlan.name} plan`);
      return;
    }

    if (selectedPlan.amount === 0) {
      toast.info("Switching to starter plan is currently manual. Contact support.");
      return;
    }

    setLocalLoading(true);
    const sdkLoaded = await loadRazorpay();

    if (!sdkLoaded) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      setLocalLoading(false);
      return;
    }

    try {
      const order = await dispatch(createOrder({
        planId: selectedPlan.id,
        amount: selectedPlan.amount
      })).unwrap();

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error("Razorpay configuration missing.");
        setLocalLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "incident.ai",
        description: `Upgrade to ${selectedPlan.name} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await dispatch(verifyPayment(response)).unwrap();
            toast.success("Workspace upgraded successfully!");
            dispatch(fetchBillingInfo());
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => setLocalLoading(false)
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err?.detail || "Could not initiate payment");
    } finally {
      setLocalLoading(false);
    }
  };

  const currentPlanName = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Starter";

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/billing</div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Billing & Subscription</h1>
        <p className="text-sm text-zinc-600 mt-1">Manage your workspace plan and growth.</p>
      </div>

      <div className="bg-white border-2 border-black p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 neo-shadow relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-zinc-950" />
        
        <div className="flex items-center gap-6 w-full md:w-auto">
          <div className="w-16 h-16 bg-zinc-950 flex items-center justify-center border-2 border-black neo-shadow-sm shrink-0">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">Current Workspace Plan</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-zinc-950 uppercase tracking-tight">{currentPlanName}</div>
              <span className="bg-[#D4F4E4] text-black border-2 border-black text-[10px] font-mono font-bold uppercase px-2 py-0.5">Active</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 md:gap-12 w-full md:w-auto justify-start md:justify-end">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">Incidents Usage</div>
            <div className="text-lg font-black text-zinc-950 font-mono">
              {incidentCount} / {limit === Infinity ? "∞" : limit}
            </div>
            <div className="w-32 h-3 border-2 border-black bg-zinc-100 mt-2">
              <div 
                className="h-full bg-zinc-950 transition-all duration-500" 
                style={{ width: `${Math.min((incidentCount / (limit === Infinity ? 1 : limit)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-1">Renewal Cycle</div>
            <div className="text-lg font-black text-zinc-950 uppercase tracking-tight">Monthly</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {plans.map((p) => (
          <div 
            key={p.id} 
            className={`p-8 border-2 flex flex-col transition-all group ${
              p.id === plan || (p.id === 'starter' && plan === 'free')
                ? "border-black bg-zinc-50 opacity-80" 
                : p.id === "pro" 
                  ? "border-black bg-white neo-shadow-lg scale-[1.02]" 
                  : "border-black bg-white neo-shadow"
            }`}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-black tracking-tighter text-zinc-950 uppercase italic">{p.name}</h3>
                {p.id === "pro" && <span className="bg-[#FF6B6B] text-black border-2 border-black text-[10px] font-mono font-bold uppercase px-2 py-1 neo-shadow-sm">Most Popular</span>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter text-zinc-950 font-mono">{p.price}</span>
                <span className="text-sm text-zinc-500 font-bold uppercase tracking-tighter">/ month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 p-0.5 bg-zinc-950 border border-black">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 uppercase tracking-tight">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(p)}
              disabled={localLoading || p.id === plan || (p.id === 'starter' && (plan === 'free' || plan === 'starter'))}
              className={`w-full py-4 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:translate-x-1 active:translate-y-1 active:neo-shadow-none ${
                p.id === "pro" 
                  ? "bg-zinc-950 text-white hover:bg-zinc-800 neo-shadow" 
                  : "bg-white text-zinc-950 border-2 border-black hover:bg-zinc-50 neo-shadow"
              } disabled:opacity-50 disabled:neo-shadow-none disabled:translate-y-0`}
            >
              {localLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 
               (p.id === plan || (p.id === 'starter' && (plan === 'free' || plan === 'starter'))) ? "Active Plan" : `Select ${p.name}`}
              {!(p.id === plan || (p.id === 'starter' && (plan === 'free' || plan === 'starter'))) && !localLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t-2 border-black">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tighter flex items-center gap-3">
            <History className="w-6 h-6" /> Payment History
          </h3>
        </div>
        <div className="bg-white border-2 border-black neo-shadow overflow-hidden">
          <div className="p-12 text-center space-y-3">
            <div className="w-16 h-16 bg-zinc-100 border-2 border-dashed border-black mx-auto flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="text-sm font-bold text-zinc-950 uppercase tracking-widest">No transaction history</div>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">Your invoices and payment records will be listed here once you upgrade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

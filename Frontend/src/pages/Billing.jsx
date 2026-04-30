import React, { useState, useEffect } from "react";
import { CreditCard, Check, Zap, ArrowRight, Loader2 } from "lucide-react";
import api from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Billing() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({ plan: "free", incidentCount: 0, limit: 5 });

  const fetchBillingInfo = async () => {
    try {
      const { data } = await api.get("/billing/info");
      setBillingInfo(data);
    } catch (err) {
      console.error("Failed to fetch billing info", err);
    }
  };

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "₹0",
      amount: 0,
      features: ["5 Teammates", "Public Status Page", "Realtime Timeline"]
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹4,499",
      amount: 4499,
      features: ["Unlimited Teammates", "AI Assistant", "Advanced Analytics", "Custom Domains"]
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

  const handleUpgrade = async (plan) => {
    if (plan.amount === 0) {
      toast.info("You are already on the Starter plan");
      return;
    }

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your connection.");
      setLoading(false);
      return;
    }

    try {
      // Create order on backend
      const { data: order } = await api.post("/billing/create-order", {
        planId: plan.id,
        amount: plan.amount
      });

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        toast.error("Razorpay Key ID is missing in environment variables.");
        setLoading(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "incident.ai",
        description: `Upgrade to ${plan.name} Plan`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await api.post("/billing/verify-payment", response);
            toast.success("Payment successful! Your workspace has been upgraded.");
            window.location.reload();
          } catch (err) {
            console.error("Verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setLoading(false)
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#09090b",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response){
        console.error("Payment failed:", response.error);
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (err) {
      console.error("Order creation error:", err);
      toast.error(err?.response?.data?.detail || "Could not initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-2">/billing</div>
        <h1 className="text-3xl font-black tracking-tighter text-zinc-950">Billing & Subscription</h1>
        <p className="text-sm text-zinc-600 mt-1">Manage your workspace plan and payment methods.</p>
      </div>

      <div className="bg-white border border-zinc-200 p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-zinc-100 flex items-center justify-center rounded-full">
            <Zap className="w-6 h-6 text-zinc-950" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Current Plan</div>
            <div className="text-xl font-bold text-zinc-950 flex items-center gap-2">
              {billingInfo.plan.charAt(0).toUpperCase() + billingInfo.plan.slice(1)}
              <span className="bg-green-100 text-green-700 text-[10px] font-mono uppercase px-2 py-0.5 rounded">Active</span>
            </div>
          </div>
        </div>
        <div className="flex gap-12 text-right">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Incidents Used</div>
            <div className="text-sm font-semibold text-zinc-950">
              {billingInfo.incidentCount} / {billingInfo.limit === Infinity ? "Unlimited" : billingInfo.limit}
            </div>
            <div className="w-32 h-1 bg-zinc-100 mt-2">
              <div 
                className="h-full bg-zinc-950 transition-all duration-500" 
                style={{ width: `${Math.min((billingInfo.incidentCount / billingInfo.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-1">Renewal Date</div>
            <div className="text-sm font-semibold text-zinc-950">Next month</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-4">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`p-8 border bg-white flex flex-col ${plan.id === "pro" ? "border-zinc-950 shadow-xl scale-[1.02] z-10" : "border-zinc-200"}`}
          >
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black tracking-tight text-zinc-950 uppercase">{plan.name}</h3>
                {plan.id === "pro" && <span className="bg-zinc-950 text-white text-[10px] font-mono uppercase px-2 py-1">Recommended</span>}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-zinc-950">{plan.price}</span>
                <span className="text-sm text-zinc-500 font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-zinc-950 mt-0.5 shrink-0" />
                  <span className="text-sm text-zinc-700">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan)}
              disabled={loading || billingInfo.plan === plan.id}
              className={`w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 transition ${
                plan.id === "pro" 
                  ? "bg-zinc-950 text-white hover:bg-zinc-800" 
                  : "bg-white text-zinc-950 border border-zinc-200 hover:bg-zinc-50"
              } disabled:opacity-50`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : billingInfo.plan === plan.id ? "Current Plan" : `Upgrade to ${plan.name}`}
              {billingInfo.plan !== plan.id && !loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-zinc-200">
        <h3 className="text-sm font-bold text-zinc-950 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Payment History
        </h3>
        <div className="bg-white border border-zinc-200 divide-y divide-zinc-200">
          <div className="p-4 text-center text-xs text-zinc-500">
            No invoices yet. Your billing history will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}

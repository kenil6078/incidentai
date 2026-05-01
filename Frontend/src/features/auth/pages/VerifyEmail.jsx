import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyEmail as verifyEmailApi } from "../service/auth.api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("Verifying your email...");
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const verify = async () => {
      try {
        const res = await verifyEmailApi(token);
        setStatus("success");
        setMessage(res.detail || "Email verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.detail || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white neo-card p-8 border-2 border-black text-center neo-shadow">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
            <h2 className="text-2xl font-black text-black">Verifying...</h2>
            <p className="text-sm text-zinc-600 mt-2">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#D4F4E4] border-2 border-black neo-shadow rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-black">Verified!</h2>
            <p className="text-sm text-zinc-600 mt-2 mb-8">{message}</p>
            <Link
              to="/login"
              className="w-full bg-[#FF6B6B] text-black border-2 border-black py-3 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FFB5E8] border-2 border-black neo-shadow rounded-full flex items-center justify-center mb-4">
               <XCircle className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-black">Verification Failed</h2>
            <p className="text-sm text-zinc-600 mt-2 mb-8">{message}</p>
            <Link
              to="/login"
              className="w-full bg-white text-black border-2 border-black py-3 text-sm font-bold neo-shadow hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center"
            >
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

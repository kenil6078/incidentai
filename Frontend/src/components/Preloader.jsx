import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ isInitialized }) => {
  const [show, setShow] = useState(true);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let interval;
    if (!isInitialized) {
      // Simulate progress while waiting for server
      interval = setInterval(() => {
        setPercent(prev => {
          if (prev < 30) return prev + Math.random() * 5;
          if (prev < 70) return prev + Math.random() * 2;
          if (prev < 95) return prev + Math.random() * 0.5;
          return prev; // Stay at 95 until initialized
        });
      }, 200);
    } else {
      // Once initialized, jump to 100%
      setPercent(100);
      const timer = setTimeout(() => setShow(false), 1000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
    return () => clearInterval(interval);
  }, [isInitialized]);

  const displayPercent = Math.min(Math.floor(percent), 100);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
        >
          {/* Animated Grid Background */}
          <div className="absolute inset-0 grid-bg opacity-10" />

          {/* Main Content */}
          <div className="relative flex flex-col items-center max-w-xl w-full px-10">
            {/* Logo Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-16 text-center"
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black flex items-center justify-center italic">
                INCIDENT<span className="text-[#FF6B6B]">.</span>AI
              </h1>
              <div className="h-1 bg-black w-full mt-2 relative overflow-hidden">
                 <motion.div 
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 bg-[#FF6B6B] w-1/3"
                 />
              </div>
            </motion.div>

            {/* Progress Container */}
            <div className="w-full space-y-6">
              <div className="flex items-end justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-400 font-black">System Status</span>
                  <span className="text-sm font-black uppercase italic">
                    {displayPercent < 40 ? "Initializing..." : 
                     displayPercent < 90 ? "Waking up server..." : 
                     displayPercent < 100 ? "Syncing Workspace..." : "System Live"}
                  </span>
                </div>
                <div className="text-5xl font-black italic tracking-tighter">
                  {displayPercent}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-6 border-4 border-black bg-white p-1 relative neo-shadow-sm">
                <motion.div
                  className="h-full bg-black"
                  initial={{ width: "0%" }}
                  animate={{ width: `${displayPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Console Logs Simulator */}
              <div className="bg-black p-4 font-mono text-[9px] text-green-500 h-24 overflow-hidden border-2 border-black neo-shadow-sm">
                 <div className="opacity-50">
                    <div>&gt; BOOT_SEQUENCE_START</div>
                    <div>&gt; KERNEL_INIT_SUCCESS</div>
                    <div>&gt; CONNECTING_TO_REMOTE_SERVER_RENDER</div>
                    {displayPercent > 30 && <div>&gt; SERVER_HANDSHAKE_PENDING...</div>}
                    {displayPercent > 60 && <div>&gt; DB_POOL_ESTABLISHED</div>}
                    {displayPercent > 90 && <div>&gt; FETCHING_USER_STATE</div>}
                    {displayPercent === 100 && <div className="text-white font-bold">&gt; AUTHENTICATION_SYNC_COMPLETE</div>}
                    <motion.div 
                      animate={{ opacity: [0, 1] }} 
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >&gt;_</motion.div>
                 </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-10 left-0 right-0 px-10 flex justify-between items-center text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-black">
             <div>Deployment: Vercel_Edge</div>
             <div>Status: {isInitialized ? "Stable" : "Synchronizing"}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ isInitialized }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      // Small delay to ensure the exit animation is smooth and seen
      const timer = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute inset-0 grid-bg" 
          />

          {/* Floating Geometric Elements (Brutalist style) */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -left-24 w-64 h-64 border-2 border-black opacity-5 pointer-events-none"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -right-32 w-96 h-96 border-4 border-black opacity-5 pointer-events-none"
          />

          {/* Main Content */}
          <div className="relative flex flex-col items-center">
            {/* Logo Container with Scanning Effect */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative mb-12"
            >
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black flex items-center select-none">
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  INCIDENT
                </motion.span>
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-block mx-2 text-accent"
                >
                  .
                </motion.span>
                <motion.span
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  AI
                </motion.span>
              </h1>

              {/* Scanning Bar */}
              <motion.div
                animate={{ 
                  top: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-1 bg-accent/30 blur-sm pointer-events-none"
              />
            </motion.div>

            {/* Brutalist Progress Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-72 h-4 border-2 border-black bg-white neo-shadow-sm overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isInitialized ? "100%" : "70%" }}
                    transition={{ 
                      duration: isInitialized ? 0.5 : 3, 
                      ease: "easeOut"
                    }}
                    className="h-full bg-secondary"
                  />
                  
                  {/* Subtle stripes on progress bar */}
                  <div className="absolute inset-0 opacity-20" 
                       style={{ backgroundImage: 'linear-gradient(45deg, black 25%, transparent 25%, transparent 50%, black 50%, black 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }} 
                  />
                </div>
                
                {/* Percentage Marker */}
                <motion.div 
                  className="absolute -right-12 top-0 font-black text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {isInitialized ? "100%" : "RUN"}
                </motion.div>
              </div>

              {/* Dynamic Status Text */}
              <div className="h-6 overflow-hidden flex flex-col items-center">
                <motion.p
                  animate={{ y: [0, -24, -48, -72] }}
                  transition={{ duration: 8, repeat: Infinity, times: [0, 0.33, 0.66, 1] }}
                  className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 text-center"
                >
                  <span className="block h-6">Synchronizing Neural Core...</span>
                  <span className="block h-6">Establishing Secure Handshake...</span>
                  <span className="block h-6">Optimizing Response Latency...</span>
                  <span className="block h-6">Ready for Deployment.</span>
                </motion.p>
              </div>
            </div>
          </div>

          {/* Cinematic Overlay - Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-16 border-b border-black/5 flex items-center justify-between px-10 pointer-events-none">
            <div className="flex gap-4">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-black/40">Terminal_Active</div>
            </div>
            <div className="text-[10px] font-mono text-black/40">
              {new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Cinematic Overlay - Bottom Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-black/5 flex items-center justify-between px-10 pointer-events-none">
             <div className="text-[10px] font-mono text-black/40 uppercase tracking-widest">
                Deepmind / Antigravity / IncidentAI
             </div>
             <div className="flex gap-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-1 h-4 bg-black/10" />
                ))}
             </div>
          </div>

          {/* Corner Decals */}
          <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-black opacity-10 pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-black opacity-10 pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

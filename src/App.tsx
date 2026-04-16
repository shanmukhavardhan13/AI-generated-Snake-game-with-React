import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-magenta-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 gap-12">
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-2 italic">
            NEON<span className="text-cyan-400">RHYTHM</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/20" />
            <p className="text-white/40 font-mono text-xs uppercase tracking-[0.3em]">Arcade & Audio Experience</p>
            <span className="h-px w-12 bg-white/20" />
          </div>
        </motion.header>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-auto"
          >
            <SnakeGame />
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full lg:w-auto flex flex-col gap-6"
          >
            <MusicPlayer />
            
            {/* Stats Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">System Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-white/60">Latency</span>
                  <span className="text-xl font-mono text-cyan-400">12ms</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-white/60">Uptime</span>
                  <span className="text-xl font-mono text-magenta-400">99.9%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <footer className="mt-auto pt-12 text-white/20 font-mono text-[10px] uppercase tracking-widest flex items-center gap-4">
          <span>Built for AI Studio</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>v1.0.4-beta</span>
        </footer>
      </main>
    </div>
  );
}

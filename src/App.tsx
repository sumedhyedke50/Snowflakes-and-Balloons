/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Sparkles, Snowflake, HeartHandshake } from 'lucide-react';
import ParticleCanvas from './components/ParticleCanvas';
import ControlPanel from './components/ControlPanel';
import { EffectType } from './types';

const TOTAL_DURATION_MS = 5000; // 5 seconds constraint

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Trigger snowflakes or balloons sequence
  const handleTriggerEffect = (effectType: 'snowflakes' | 'balloons') => {
    // Clear any running interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setActiveEffect(effectType);
    setTimeLeftMs(TOTAL_DURATION_MS);
    startTimeRef.current = Date.now();

    // Smooth state update tick
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, TOTAL_DURATION_MS - elapsed);
      
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setActiveEffect('none');
        setTimeLeftMs(0);
      }
    }, 50); // very fast ticking (20fps) for fluid progress updates
  };

  // Halt simulation
  const handleClearEffect = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveEffect('none');
    setTimeLeftMs(0);
  };

  // Safe timer disposal on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col justify-between items-center bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] antialiased">
      {/* Upper Status Ribbon */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-200/50 relative z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-sm border border-zinc-700">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-zinc-950 uppercase tracking-widest leading-none">
              Lab Environment
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
              Ref: CSS.PARTICLES.V1
            </div>
          </div>
        </div>

        {/* Diagnostic display */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Scale: Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>Gate: 5.0 Seconds</span>
          </div>
        </div>
      </header>

      {/* Main Simulation Arena */}
      <main className="flex-1 w-full flex items-center justify-center p-4 sm:p-6 relative">
        {/* Particle Canvas beneath everything else */}
        <ParticleCanvas activeEffect={activeEffect} durationMs={TOTAL_DURATION_MS} />

        {/* Ambient background decoration details adding to layout polish */}
        <div className="absolute inset-x-0 top-1/4 flex justify-between px-12 pointer-events-none opacity-40 select-none">
          <div className="text-[10px] font-mono text-zinc-300 transform -rotate-90 origin-left">
            LATENCY: OPTIMAL | COORDINATE_LIDAR_ACTIVE
          </div>
          <div className="text-[10px] font-mono text-zinc-300 transform rotate-90 origin-right">
            GRID_FRAME_LOCK: ENABLED
          </div>
        </div>

        {/* Entrance motion frame for the control widget */}
        <motion.div
          id="control-deck-outer"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 w-full flex justify-center"
        >
          <ControlPanel
            activeEffect={activeEffect}
            timeLeftMs={timeLeftMs}
            totalDurationMs={TOTAL_DURATION_MS}
            onTriggerEffect={handleTriggerEffect}
            onClearEffect={handleClearEffect}
          />
        </motion.div>
      </main>

      {/* Footer Info deck */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-zinc-400 text-xs border-t border-slate-200/50 relative z-50 gap-4">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>© 2026</span>
          <span className="w-1 h-1 rounded-full bg-zinc-300" />
          <span>Interactive Canvas Corp.</span>
        </div>
        
        {/* Subtle quick shortcuts */}
        <div className="flex items-center gap-5 text-[10px] font-mono">
          <span className="hover:text-zinc-600 transition-colors">Vite + React 19</span>
          <span className="text-zinc-300">|</span>
          <span className="hover:text-zinc-600 transition-colors flex items-center gap-1">
            <HeartHandshake size={12} />
            Formal Design Spec
          </span>
        </div>
      </footer>
    </div>
  );
}

import { Snowflake, Sparkles, Clock, ShieldAlert, Cpu } from 'lucide-react';
import { EffectType } from '../types';

interface ControlPanelProps {
  activeEffect: EffectType;
  timeLeftMs: number;
  totalDurationMs: number;
  onTriggerEffect: (effect: 'snowflakes' | 'balloons') => void;
  onClearEffect: () => void;
}

export default function ControlPanel({
  activeEffect,
  timeLeftMs,
  totalDurationMs,
  onTriggerEffect,
  onClearEffect,
}: ControlPanelProps) {
  // Compute nice floating-point countdown
  const secondsLeft = (timeLeftMs / 1000).toFixed(1);
  const progressPercent = Math.max(0, Math.min(100, (timeLeftMs / totalDurationMs) * 100));

  return (
    <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 shadow-xl overflow-hidden relative z-50">
      {/* Precision Header bar resembling a control panel */}
      <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-zinc-400 uppercase font-bold">
            Sim Core v1.4
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
          <Cpu size={14} className="text-zinc-500" />
          <span>Active Deck</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Title and subtitle */}
        <div className="text-center space-y-2">
          <h1 id="simulation-title" className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-zinc-900">
            Interactive Canvas
          </h1>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Configure dynamic, physics-guided vector environments for finite 5-second runtimes.
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Snowflakes Trigger Button */}
          <button
            id="snowflake-trigger-btn"
            onClick={() => onTriggerEffect('snowflakes')}
            className={`
              relative group flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all duration-300
              ${
                activeEffect === 'snowflakes'
                  ? 'bg-sky-50/90 border-sky-300 text-sky-800 shadow-sm shadow-sky-100/50'
                  : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-700 hover:text-zinc-900'
              }
              active:scale-[0.98] cursor-pointer
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`
                p-2 rounded-lg transition-colors
                ${activeEffect === 'snowflakes' ? 'bg-sky-500 text-white' : 'bg-zinc-200 text-zinc-600 group-hover:bg-zinc-300'}
              `}>
                <Snowflake size={18} className={activeEffect === 'snowflakes' ? 'animate-[spin_4s_linear_infinite]' : ''} />
              </span>
              <div className="text-left">
                <span className="block font-semibold">Snowflakes</span>
                <span className="block text-xs text-zinc-400 font-sans font-normal">Medium scale fall</span>
              </div>
            </div>
            <div className="text-xs font-mono bg-white px-2 py-1 rounded border border-zinc-200/60 shadow-2xs text-zinc-500">
              5s
            </div>
          </button>

          {/* Balloons Trigger Button */}
          <button
            id="balloon-trigger-btn"
            onClick={() => onTriggerEffect('balloons')}
            className={`
              relative group flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all duration-300
              ${
                activeEffect === 'balloons'
                  ? 'bg-rose-50/90 border-rose-300 text-rose-800 shadow-sm shadow-rose-100/50'
                  : 'bg-zinc-50 hover:bg-zinc-100/70 border-zinc-200 text-zinc-700 hover:text-zinc-900'
              }
              active:scale-[0.98] cursor-pointer
            `}
          >
            <div className="flex items-center gap-3">
              <span className={`
                p-2 rounded-lg transition-colors
                ${activeEffect === 'balloons' ? 'bg-rose-500 text-white' : 'bg-zinc-200 text-zinc-600 group-hover:bg-zinc-300'}
              `}>
                <Sparkles size={18} />
              </span>
              <div className="text-left">
                <span className="block font-semibold">Balloons</span>
                <span className="block text-xs text-zinc-400 font-sans font-normal">Medium scale rise</span>
              </div>
            </div>
            <div className="text-xs font-mono bg-white px-2 py-1 rounded border border-zinc-200/60 shadow-2xs text-zinc-500">
              5s
            </div>
          </button>
        </div>

        {/* Dynamic Telemetry / Status Indicator */}
        <div className="border border-zinc-100 bg-zinc-50/50 rounded-xl p-4 transition-all duration-300">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="text-zinc-400 font-mono uppercase tracking-wider">Simulation Feed</span>
            <span className={`px-2 py-0.5 rounded-full font-mono font-medium ${
              activeEffect === 'none' 
                ? 'bg-zinc-200 text-zinc-600' 
                : activeEffect === 'snowflakes' 
                ? 'bg-sky-100 text-sky-800 animate-pulse' 
                : 'bg-rose-100 text-rose-800 animate-pulse'
            }`}>
              {activeEffect === 'none' && 'IDLE'}
              {activeEffect === 'snowflakes' && 'SIMULATING SNOWFALL'}
              {activeEffect === 'balloons' && 'SIMULATING BALLOON LIFT'}
            </span>
          </div>

          {activeEffect !== 'none' ? (
            <div id="simulation-telemetry" className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <Clock size={14} className="text-zinc-400 animate-spin" />
                  <span>Time Remaining:</span>
                </div>
                <span className="font-mono font-bold text-zinc-800">{secondsLeft}s</span>
              </div>
              
              {/* Clean mechanical progress meter */}
              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-100 ease-linear ${
                    activeEffect === 'snowflakes' ? 'bg-sky-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
                <span>0.0s</span>
                <span>Active Terminal Lock</span>
                <span>5.0s</span>
              </div>
            </div>
          ) : (
            <div className="py-2 flex items-center justify-center gap-2 text-zinc-400 text-xs">
              <ShieldAlert size={14} />
              <span>Select simulation mode above to initiate environmental grid.</span>
            </div>
          )}
        </div>

        {/* Clear/Reset Action */}
        {activeEffect !== 'none' && (
          <button
            id="simulation-reset-btn"
            onClick={onClearEffect}
            className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors py-1 cursor-pointer underline underline-offset-4 decoration-zinc-200 hover:decoration-zinc-400"
          >
            Terminal Overide: Halt Environment Current State
          </button>
        )}
      </div>

      {/* Decorative technical bottom grid accent */}
      <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-4 text-center">
        <span className="text-[10px] font-mono text-zinc-400 tracking-tight leading-none block">
          Designed with rigid desktop canvas coordinates. Built with optimized React 19 vector render loops.
        </span>
      </div>
    </div>
  );
}

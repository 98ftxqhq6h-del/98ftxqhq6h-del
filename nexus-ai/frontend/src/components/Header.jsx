import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Mic, MicOff, ShieldCheck, Zap, Radio } from 'lucide-react';

export default function Header({ isVoiceActive, setIsVoiceActive, activeProvider }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [cpuUsage, setCpuUsage] = useState(14);
  const [ramUsage, setRamUsage] = useState(3.8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setCpuUsage(Math.floor(12 + Math.random() * 8));
      setRamUsage(parseFloat((3.7 + Math.random() * 0.3).toFixed(1)));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#07090d]/90 backdrop-blur-md border-b border-cyan-500/20 px-6 py-3 flex items-center justify-between shadow-lg shadow-cyan-950/20">
      {/* Brand & System Logo */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-cyan-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 shadow-md shadow-cyan-500/30">
            <Zap className="w-5 h-5 text-slate-950 fill-current" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              NEXUS AI
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 tracking-widest">
              v2.5.0 OS
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse inline mr-1" />
            SUPERINTELLIGENCE OPERATIONAL
          </p>
        </div>
      </div>

      {/* Center System Telemetry Metrics */}
      <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-cyan-500/10">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>CPU:</span>
          <span className="text-cyan-300 font-bold">{cpuUsage}%</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-cyan-500/10">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>RAM:</span>
          <span className="text-emerald-300 font-bold">{ramUsage} GB</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-cyan-500/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ENGINE:</span>
          <span className="text-emerald-300 font-bold uppercase">{activeProvider}</span>
        </div>
      </div>

      {/* Right Action Tools & Clock */}
      <div className="flex items-center space-x-4">
        {/* Voice Assistant Toggle */}
        <button
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            isVoiceActive
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20 animate-pulse'
              : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
          }`}
          title="Toggle Web Speech Voice Assistant"
        >
          {isVoiceActive ? (
            <>
              <Mic className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">VOICE LISTENING</span>
            </>
          ) : (
            <>
              <MicOff className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">VOICE STANDBY</span>
            </>
          )}
        </button>

        {/* System Clock */}
        <div className="text-right font-mono hidden sm:block">
          <div className="text-xs font-bold text-cyan-400 tracking-wider">{time}</div>
          <div className="text-[10px] text-slate-500">SYS_TIME</div>
        </div>
      </div>
    </header>
  );
}

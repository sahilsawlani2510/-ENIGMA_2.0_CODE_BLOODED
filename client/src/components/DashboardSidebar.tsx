import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedScore } from './AnimatedScore';
import { CustomSlider, ToggleSwitch } from './CustomControls';
import { Activity, ShieldCheck, ThermometerSun, AlertOctagon } from 'lucide-react';

interface DashboardSidebarProps {
  greenCover: number;
  setGreenCover: (val: number) => void;
  floodActive: boolean;
  setFloodActive: (val: boolean) => void;
  healthScore: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  greenCover,
  setGreenCover,
  floodActive,
  setFloodActive,
  healthScore
}) => {

  // Define status based on state combinations
  let statusText = "SYSTEM NOMINAL";
  let statusColor = "text-emerald-400";
  let StatusIcon = ShieldCheck;

  if (floodActive) {
    statusText = "CRITICAL FLOODING";
    statusColor = "text-red-500";
    StatusIcon = AlertOctagon;
  } else if (greenCover < 15) {
    statusText = "HIGH HEAT RISK";
    statusColor = "text-amber-400";
    StatusIcon = ThermometerSun;
  }

  return (
    <motion.div 
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.2 }}
      className="absolute top-6 left-6 bottom-6 w-[380px] glass-panel rounded-3xl flex flex-col overflow-hidden z-20"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-slate-900/80 to-transparent">
        <div className="flex items-center gap-3 mb-1">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h1 className="font-display text-2xl font-bold text-white tracking-widest uppercase">
            Resilient City
          </h1>
        </div>
        <p className="text-slate-400 text-sm">Navi Mumbai • SDG 11 Digital Twin</p>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Score Section */}
        <section className="flex flex-col items-center">
          <h2 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mb-2">
            Overall City Health
          </h2>
          <AnimatedScore score={healthScore} />
          
          <div className={`mt-4 px-4 py-2 rounded-full border bg-slate-900/50 flex items-center gap-2 backdrop-blur-md ${
            statusColor.replace('text-', 'border-').replace('400', '500/30').replace('500', '500/30')
          }`}>
            <StatusIcon className={`w-4 h-4 ${statusColor}`} />
            <span className={`text-xs font-bold tracking-widest ${statusColor}`}>
              {statusText}
            </span>
          </div>
        </section>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Controls Section */}
        <section className="space-y-8">
          
          {/* Green Cover Control */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  Urban Green Cover
                </h3>
                <p className="text-xs text-slate-400 mt-1">Mitigates urban heat island effect</p>
              </div>
              <span className="font-display text-xl font-bold text-emerald-400">
                {greenCover}%
              </span>
            </div>
            
            <div className="pt-2">
              <CustomSlider 
                value={greenCover} 
                onChange={setGreenCover} 
                min={0} 
                max={50} 
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-bold tracking-wider">
                <span>0% (CONCRETE)</span>
                <span>50% (FOREST CITY)</span>
              </div>
            </div>
          </div>

          {/* Disaster Simulation Control */}
          <div className="space-y-4 pt-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Disaster Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-1">Test infrastructure resilience</p>
            </div>
            
            <ToggleSwitch 
              isActive={floodActive} 
              onToggle={() => setFloodActive(!floodActive)} 
            />
          </div>

        </section>
      </div>

      {/* Footer Details */}
      <div className="p-4 border-t border-white/5 bg-slate-950/80 text-[10px] text-slate-500 font-mono flex justify-between">
        <span>LAT: 19.0330 N</span>
        <span>LON: 73.0297 E</span>
      </div>
    </motion.div>
  );
};

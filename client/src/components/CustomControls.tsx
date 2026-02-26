import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Waves, AlertTriangle } from 'lucide-react';

interface CustomSliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const CustomSlider: React.FC<CustomSliderProps> = ({ value, onChange, min = 0, max = 50 }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative w-full h-10 flex items-center group">
      {/* Track */}
      <div className="absolute w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Native Range Input (Hidden but interactive) */}
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-full opacity-0 cursor-pointer z-20"
      />

      {/* Thumb indicator */}
      <motion.div 
        className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] border-2 border-emerald-500 z-10 flex items-center justify-center pointer-events-none"
        style={{ left: `calc(${percentage}% - 12px)` }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <Leaf className="w-3 h-3 text-emerald-600" />
      </motion.div>
    </div>
  );
};

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-full h-14 rounded-xl p-1 transition-colors duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${
        isActive 
          ? 'bg-red-900/40 border border-red-500/50 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)] focus:ring-red-500' 
          : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50 focus:ring-slate-500'
      }`}
    >
      <div className="flex-1 flex items-center justify-center gap-2 z-10 text-sm font-bold tracking-wide">
        {isActive ? (
          <span className="text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 animate-pulse" /> 
            EMERGENCY ACTIVE
          </span>
        ) : (
          <span className="text-slate-300 flex items-center gap-2">
            <Waves className="w-4 h-4" />
            SIMULATE FLOOD
          </span>
        )}
      </div>

      {/* Animated active background pill */}
      <motion.div
        className={`absolute top-1 bottom-1 rounded-lg ${isActive ? 'bg-red-500/20' : 'bg-transparent'}`}
        initial={false}
        animate={{ 
          left: isActive ? '4px' : '4px', 
          right: isActive ? '4px' : '4px',
          opacity: isActive ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </button>
  );
};

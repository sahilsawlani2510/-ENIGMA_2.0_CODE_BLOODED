import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedScoreProps {
  score: number;
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({ score }) => {
  // Use a physics spring for smooth, satisfying number rolling
  const spring = useSpring(score, { 
    mass: 1, 
    stiffness: 70, 
    damping: 15 
  });

  // Keep spring in sync with incoming score prop
  useEffect(() => {
    spring.set(score);
  }, [score, spring]);

  // Round the interpolated value for display
  const displayValue = useTransform(spring, (current) => Math.round(current));

  // Determine color based on score threshold
  const getColorClass = (val: number) => {
    if (val >= 80) return "text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]";
    if (val >= 50) return "text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    return "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  };

  return (
    <div className="relative flex items-center justify-center py-6">
      {/* Background glowing ring */}
      <svg className="absolute w-40 h-40 transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-slate-800"
        />
        <motion.circle
          cx="80"
          cy="80"
          r="70"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray="439.8" // 2 * PI * 70
          strokeDashoffset={useTransform(spring, v => 439.8 - (v / 100) * 439.8)}
          className={getColorClass(score)}
          style={{ strokeLinecap: 'round' }}
        />
      </svg>
      
      <div className="text-center z-10 flex flex-col items-center">
        <motion.span 
          className={`font-display text-6xl font-bold tracking-tighter tabular-nums ${getColorClass(score)}`}
        >
          {displayValue}
        </motion.span>
        <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase mt-1">
          Index
        </span>
      </div>
    </div>
  );
};

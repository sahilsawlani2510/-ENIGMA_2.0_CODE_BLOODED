import React, { useState, useMemo } from 'react';
import { DigitalTwinMap } from '@/components/DigitalTwinMap';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { motion } from 'framer-motion';

export default function Home() {
  // Main Simulation State housed entirely in the React frontend
  const [greenCover, setGreenCover] = useState<number>(15); // Default 15%
  const [floodActive, setFloodActive] = useState<boolean>(false);

  // Calculate Health Score dynamically based on the requested formula structure:
  // - 40% green cover contribution (max 40 pts at 50% cover)
  // - 30% inverse heat average (heat is reduced by green cover. Max 30 pts)
  // - 30% flood penalty
  const healthScore = useMemo(() => {
    // Green cover contributes proportionally up to 40 points
    const greenContribution = (greenCover / 50) * 40;
    
    // Heat is inherently high (0 pts) when green cover is 0, and low (30 pts) when green cover is 50.
    const heatMitigation = (greenCover / 50) * 30;
    
    // Flood penalty: If active, we lose the 30 base points allocated to flood safety.
    const floodContribution = floodActive ? 0 : 30;

    let total = Math.round(greenContribution + heatMitigation + floodContribution);
    
    // Clamp between 0 and 100 just in case
    return Math.max(0, Math.min(100, total));
  }, [greenCover, floodActive]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      
      {/* 3D Map Background */}
      <DigitalTwinMap 
        greenCover={greenCover} 
        floodActive={floodActive} 
      />

      {/* Foreground UI Overlay */}
      <DashboardSidebar 
        greenCover={greenCover}
        setGreenCover={setGreenCover}
        floodActive={floodActive}
        setFloodActive={setFloodActive}
        healthScore={healthScore}
      />

      {/* Subtle UI Accents */}
      <div className="absolute top-0 right-0 p-6 pointer-events-none z-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1 }}
          className="flex items-center gap-2 text-xs font-mono text-slate-400"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE DATA STREAM ACTIVE
        </motion.div>
      </div>
      
      {/* Vignette Overlay for deeper integration */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-slate-950/80 z-0" />
    </main>
  );
}

import { motion } from 'framer-motion';
import { LineChart, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface EnergyDataPoint {
  time: string;
  value: number;
}

interface EnergyGraphProps {
  data: EnergyDataPoint[];
  className?: string;
}

export function EnergyGraph({ data, className }: EnergyGraphProps) {
  // Normalize data points to fit in the graph
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - ((d.value / maxValue) * 80) // Keep within 80% height for visual padding
  }));

  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className={cn('industrial-card p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="w-5 h-5 text-cooling-500" />
        <h3 className="font-sans font-bold">Energy Usage</h3>
      </div>
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="2,2"
            />
          ))}
          
          {/* Energy usage line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="drop-shadow-[0_0_3px_rgba(0,194,212,0.5)]"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00C2D4" />
              <stop offset="100%" stopColor="#FF5E1A" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Current value indicator */}
        <div className="absolute top-0 right-0 bg-steel-800/90 px-2 py-1 rounded-md flex items-center gap-2">
          <Activity size={14} className="text-cooling-500" />
          <span className="font-mono text-sm">{data[data.length - 1].value} kW</span>
        </div>
      </div>
    </div>
  );
}
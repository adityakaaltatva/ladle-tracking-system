import { motion, useAnimation } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface LadlePosition {
  id: string;
  x: number;
  y: number;
  status: 'charging' | 'transport' | 'pouring';
  route?: { x: number; y: number }[];
}

interface LadleMapProps {
  positions: LadlePosition[];
  className?: string;
  onSelectLadle?: (id: string) => void;
}

export function LadleMap({ positions, className, onSelectLadle }: LadleMapProps) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const controls = useAnimation();

  const getStatusColor = (status: LadlePosition['status']) => {
    switch (status) {
      case 'charging': return 'text-warning-500';
      case 'transport': return 'text-cooling-500';
      case 'pouring': return 'text-molten-500';
      default: return 'text-gray-400';
    }
  };

  useEffect(() => {
    const animatePositions = async () => {
      for (const position of positions) {
        if (position.route) {
          for (const point of position.route) {
            await controls.start(position.id, {
              left: `${point.x}%`,
              top: `${point.y}%`,
              transition: {
                duration: 2,
                ease: "easeInOut"
              }
            });
          }
        }
      }
    };

    animatePositions();
  }, [positions, controls]);

  return (
    <div className={cn('industrial-card p-4 relative min-h-[300px]', className)}>
      <div className="absolute inset-4">
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="border border-white/5"
            />
          ))}
        </div>

        {/* Plant sections */}
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] border-2 border-cooling-500/30 rounded-lg flex items-center justify-center">
            <span className="font-mono text-cooling-500 text-sm">SMS-1</span>
          </div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] border-2 border-cooling-500/30 rounded-lg flex items-center justify-center">
            <span className="font-mono text-cooling-500 text-sm">SMS-2</span>
          </div>
        </div>

        {/* Movement paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {positions.map((pos) => pos.route?.map((point, i, arr) => {
            if (i === arr.length - 1) return null;
            const next = arr[i + 1];
            return (
              <line
                key={`${pos.id}-${i}`}
                x1={`${point.x}%`}
                y1={`${point.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="rgba(0, 194, 212, 0.2)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            );
          }))}
        </svg>

        {/* Ladle positions */}
        {positions.map((pos) => (
          <motion.div
            key={pos.id}
            initial={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            animate={controls}
            custom={pos.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={cn(
                "relative flex items-center justify-center cursor-pointer group",
                getStatusColor(pos.status)
              )}
              onClick={() => onSelectLadle?.(pos.id)}
            >
              <MapPin size={24} className="drop-shadow-glow" />
              <span className="absolute -top-6 font-mono text-xs whitespace-nowrap">
                {pos.id}
              </span>
              
              {/* Camera icon */}
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className="absolute -right-8 top-0 bg-steel-800 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCamera(selectedCamera === pos.id ? null : pos.id);
                }}
              >
                <Camera size={16} className="text-cooling-500" />
              </motion.button>
            </motion.div>
          </motion.div>
        ))}

        {/* Camera View */}
        {selectedCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-steel-900/90 backdrop-blur-sm rounded-lg p-4 z-10"
          >
            <div className="relative h-full">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                onClick={() => setSelectedCamera(null)}
              >
                Close
              </button>
              <div className="flex items-center gap-2 mb-4">
                <Camera size={20} className="text-cooling-500" />
                <h4 className="font-mono">Camera View: {selectedCamera}</h4>
              </div>
              <div className="relative h-[calc(100%-2rem)] rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm text-gray-400">Live Feed</span>
                </div>
                <div className="absolute inset-0 border-2 border-cooling-500/30 rounded-lg"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-cooling-500/20 animate-[scan_2s_linear_infinite]"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Flame, Thermometer as ThermometerHot } from 'lucide-react';
import { cn } from '../lib/utils';

interface LadleCardProps {
  id: string;
  location: string;
  temperature: number;
  health: number;
  className?: string;
}

export function LadleCard({ id, location, temperature, health, className }: LadleCardProps) {
  const healthColor = health > 80 ? 'bg-green-500' : health > 50 ? 'bg-warning-500' : 'bg-molten-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('industrial-card p-4', className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-sans font-bold text-xl text-cooling-500">{id}</h3>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
        <div className="flex items-center space-x-1 text-molten-500">
          <ThermometerHot size={18} className="animate-pulse" />
          <span className="font-mono">{temperature}°C</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Refractory Health</span>
          <span className="flex items-center gap-2">
            <Flame className={cn('w-4 h-4', healthColor)} />
            {health}%
          </span>
        </div>
        <div className="h-2 bg-steel-900/50 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', healthColor)}
            style={{ width: `${health}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
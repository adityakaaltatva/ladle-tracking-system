import { motion } from 'framer-motion';
import { AlertTriangle, Gauge } from 'lucide-react';
import { cn } from '../lib/utils';

interface PredictiveAlertProps {
  ladleId: string;
  riskLevel: number; // 0-100
  location: string;
  prediction: string;
  className?: string;
}

export function PredictiveAlert({ ladleId, riskLevel, location, prediction, className }: PredictiveAlertProps) {
  const getRiskColor = () => {
    if (riskLevel > 75) return 'text-molten-500';
    if (riskLevel > 50) return 'text-warning-500';
    return 'text-cooling-500';
  };

  return (
    <div className={cn('industrial-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning-500" />
          <h3 className="font-sans font-bold">Predictive Alert</h3>
        </div>
        <div className="flex items-center gap-2">
          <Gauge size={16} className={getRiskColor()} />
          <span className="font-mono text-sm">{riskLevel}% Risk</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-steel-900/50 p-3 rounded-lg">
            <span className="text-xs text-gray-400">Ladle ID</span>
            <div className="font-mono text-cooling-500">{ladleId}</div>
          </div>
          <div className="bg-steel-900/50 p-3 rounded-lg">
            <span className="text-xs text-gray-400">Location</span>
            <div className="font-mono text-cooling-500">{location}</div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-steel-900/50 p-3 rounded-lg"
        >
          <span className="text-xs text-gray-400">AI Prediction</span>
          <div className="text-sm text-gray-200 mt-1">{prediction}</div>
        </motion.div>

        <div className="relative h-2 bg-steel-900/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskLevel}%` }}
            transition={{ duration: 1 }}
            className={cn(
              'absolute h-full rounded-full',
              getRiskColor().replace('text-', 'bg-')
            )}
          />
        </div>
      </div>
    </div>
  );
}
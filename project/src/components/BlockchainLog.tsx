import { motion } from 'framer-motion';
import { Link2, Clock, Hash } from 'lucide-react';
import { cn } from '../lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  ladleId: string;
  operation: string;
  hash: string;
  message: string;
}

interface BlockchainLogProps {
  entries: LogEntry[];
  className?: string;
}

export function BlockchainLog({ entries, className }: BlockchainLogProps) {
  return (
    <div className={cn('industrial-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-cooling-500" />
          <h3 className="font-sans font-bold">Blockchain Ledger</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>Last updated: Just now</span>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-steel-900/50 p-3 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-cooling-500 font-mono">{entry.ladleId}</span>
                <span className="mx-2 text-gray-500">|</span>
                <span className="text-gray-400">{entry.operation}</span>
              </div>
              <span className="text-xs text-gray-500">{entry.timestamp}</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{entry.message}</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Hash size={12} />
              <span className="font-mono">{entry.hash}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
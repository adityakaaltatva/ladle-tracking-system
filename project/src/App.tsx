import { Activity, AlertTriangle, Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BlockchainLog } from './components/BlockchainLog';
import { EnergyGraph } from './components/EnergyGraph';
import { LadleCard } from './components/LadleCard';
import { LadleMap } from './components/LadleMap';
import { PredictiveAlert } from './components/PredictiveAlert';
import { cn } from './lib/utils';

// Initial mock data
const initialEnergyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: 350 + Math.random() * 100
}));

const initialLadlePositions = [
  { 
    id: 'SL-124', 
    x: 25, 
    y: 30, 
    status: 'charging' as const,
    route: [
      { x: 25, y: 30 },
      { x: 40, y: 40 },
      { x: 75, y: 40 },
      { x: 75, y: 30 }
    ]
  },
  { 
    id: 'SP-124', 
    x: 75, 
    y: 60, 
    status: 'pouring' as const,
    route: [
      { x: 75, y: 60 },
      { x: 40, y: 70 },
      { x: 25, y: 60 }
    ]
  },
  { 
    id: 'SLBC-1', 
    x: 40, 
    y: 80, 
    status: 'transport' as const,
    route: [
      { x: 40, y: 80 },
      { x: 60, y: 70 },
      { x: 75, y: 80 }
    ]
  },
];

const initialBlockchainLogs = [
  {
    id: '1',
    timestamp: '2025-03-15 14:30:22',
    ladleId: 'SL-124',
    operation: 'Temperature Update',
    hash: '0x7f2c8d3e...',
    message: 'Temperature recorded: 1450°C at SLBC-1'
  },
  {
    id: '2',
    timestamp: '2025-03-15 14:29:15',
    ladleId: 'SP-124',
    operation: 'Position Change',
    hash: '0x3a9b1c7d...',
    message: 'Moved from SLBC-4 to Pouring Station'
  }
];

function App() {
  const [energyData, setEnergyData] = useState(initialEnergyData);
  const [ladlePositions, setLadlePositions] = useState(initialLadlePositions);
  const [blockchainLogs, setBlockchainLogs] = useState(initialBlockchainLogs);
  const [selectedLadle, setSelectedLadle] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update energy data
      setEnergyData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time,
          value: 350 + Math.random() * 100
        });
        return newData;
      });

      // Add new blockchain log
      const operations = ['Temperature Update', 'Position Change', 'Maintenance Check'];
      const randomOperation = operations[Math.floor(Math.random() * operations.length)];
      const randomLadle = initialLadlePositions[Math.floor(Math.random() * initialLadlePositions.length)];
      
      setBlockchainLogs(prev => [{
        id: Date.now().toString(),
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        ladleId: randomLadle.id,
        operation: randomOperation,
        hash: '0x' + Math.random().toString(16).slice(2, 10) + '...',
        message: `${randomOperation} completed for ${randomLadle.id}`
      }, ...prev.slice(0, 4)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-white">
            Molten Metal HUD
          </h1>
          <p className="text-gray-400 mt-1">Steel Plant Command Center</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-warning-500">
            <AlertTriangle size={20} className="animate-pulse" />
            <span className="font-mono">3 Alerts</span>
          </div>
          <div className="flex items-center gap-2 text-cooling-500">
            <Activity size={20} />
            <span className="font-mono">System Nominal</span>
          </div>
        </div>
      </header>

      <main className="space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Status & Energy Panel */}
          <div className="space-y-6">
            <div className="industrial-card glow-border p-6">
              <div className="flex items-center gap-4 mb-4">
                <Gauge className="w-8 h-8 text-cooling-500" />
                <h2 className="font-sans text-xl font-bold">Live Status</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <LadleCard
                  id="SL-124"
                  location="SLBC-1"
                  temperature={1450}
                  health={92}
                />
                <LadleCard
                  id="SP-124"
                  location="SLBC-4"
                  temperature={1380}
                  health={78}
                />
              </div>
              <EnergyGraph data={energyData} />
            </div>
            <LadleMap 
              positions={ladlePositions} 
              onSelectLadle={setSelectedLadle}
            />
          </div>

          {/* Ladle Tracker */}
          <div className="industrial-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-sans text-xl font-bold">Ladle Tracker</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-steel-900/50 text-sm hover:bg-steel-900/70 transition-colors">
                  Route
                </button>
                <button className="px-3 py-1 rounded bg-steel-900/50 text-sm hover:bg-steel-900/70 transition-colors">
                  Time
                </button>
                <button className="px-3 py-1 rounded bg-steel-900/50 text-sm hover:bg-steel-900/70 transition-colors">
                  Type
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "bg-steel-900/50 p-3 rounded-lg flex items-center justify-between transition-colors",
                    selectedLadle === `LD-${(i + 1).toString().padStart(2, '0')}` && "bg-steel-900/70 ring-1 ring-cooling-500"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-cooling-500">
                      LD-{(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="text-gray-400">SLBC-{i + 1}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-molten-500 font-mono">1450°C</span>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Predictive Alerts */}
          <PredictiveAlert
            ladleId="LD-12"
            riskLevel={78}
            location="SLBC-4"
            prediction="High risk of refractory failure within next 3 heats. Schedule maintenance."
          />

          {/* Blockchain Ledger */}
          <BlockchainLog entries={blockchainLogs} />
        </div>
      </main>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        Made by Aditya and team #cyphers
      </footer>
    </div>
  );
}

export default App;
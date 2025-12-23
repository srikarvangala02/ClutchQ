
import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, Loader2, AlertTriangle, CheckCircle2, Activity, Radio, Volume2 } from 'lucide-react';
import { GameState, PitStopPrediction, SportType } from '../types';
import { predictBestTime } from '../services/geminiService';

interface PitStopPredictorProps {
  currentSport: SportType;
}

const PitStopPredictor: React.FC<PitStopPredictorProps> = ({ currentSport }) => {
  const [gameState, setGameState] = useState<GameState>({
    sport: currentSport,
    currentPeriod: '1st Quarter',
    timeRemaining: '12:45',
    recentEvent: 'Kickoff complete',
    isCommercialBreak: false,
    score: { home: 0, away: 0 },
    gamePhase: 'LIVE'
  });
  const [prediction, setPrediction] = useState<PitStopPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(true);
  
  const lastAnalyzedEvent = useRef<string>('');

  // 1. Simulate Live Game Feed
  useEffect(() => {
    if (!isAutoSyncing) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const events = {
          [SportType.FOOTBALL]: ['Touchdown!', 'Incomplete Pass', 'TV Timeout', 'First Down', 'Official Review', 'Punt coming up'],
          [SportType.BASEBALL]: ['Strikeout', 'Home Run!', 'Pitching Change', 'Between Innings', 'Full Count', 'Foul Ball'],
          [SportType.BASKETBALL]: ['3-Pointer!', 'Foul called', 'Full Timeout', 'Free Throws', 'Substitution', 'Fast Break'],
          [SportType.SOCCER]: ['Goal!', 'Yellow Card', 'Corner Kick', 'Injury Delay', 'Offside', 'Goal Kick']
        };
        
        const sportEvents = events[prev.sport] || events[SportType.FOOTBALL];
        const newEvent = sportEvents[Math.floor(Math.random() * sportEvents.length)];
        const isComm = newEvent.toLowerCase().includes('timeout') || newEvent.toLowerCase().includes('between') || Math.random() > 0.85;

        // Minor score/time simulation
        const isScore = newEvent.includes('!') || newEvent.includes('Goal');
        
        return {
          ...prev,
          recentEvent: newEvent,
          isCommercialBreak: isComm,
          gamePhase: isComm ? 'BREAK' : 'LIVE',
          score: isScore ? { ...prev.score, home: prev.score.home + Math.floor(Math.random() * 7) } : prev.score,
          timeRemaining: `${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        };
      });
    }, 8000); // New event every 8 seconds

    return () => clearInterval(interval);
  }, [isAutoSyncing, currentSport]);

  // 2. Sync sport reset
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      sport: currentSport,
      currentPeriod: currentSport === SportType.BASEBALL ? 'Top 1st' : '1st Quarter',
      score: { home: 0, away: 0 }
    }));
    setPrediction(null);
  }, [currentSport]);

  // 3. Auto-Trigger AI Analysis when significant events happen
  useEffect(() => {
    const triggerAnalysis = async () => {
      if (gameState.recentEvent === lastAnalyzedEvent.current) return;
      
      // We analyze if it's a commercial break OR every few events
      if (gameState.isCommercialBreak || Math.random() > 0.6) {
        setLoading(true);
        const result = await predictBestTime(gameState);
        setPrediction(result);
        setLoading(false);
        lastAnalyzedEvent.current = gameState.recentEvent;
      }
    };

    triggerAnalysis();
  }, [gameState]);

  const getStatusStyles = (rec: string) => {
    switch (rec) {
      case 'GO_NOW': return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400';
      case 'URGENT': return 'border-amber-500/30 bg-amber-500/5 text-amber-400';
      case 'WAIT': return 'border-rose-500/30 bg-rose-500/5 text-rose-400';
      default: return 'border-slate-700 bg-slate-800/50 text-slate-400';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Live Feed Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-slate-800/50 px-5 py-3 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Intel Stream</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950 rounded-full border border-slate-700/50">
            <Radio className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-bold text-blue-400 uppercase">Automated</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{gameState.score.home}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">HOME</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-blue-400 font-mono text-sm font-bold shadow-inner">
                {gameState.timeRemaining}
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                {gameState.currentPeriod}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white">{gameState.score.away}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">AWAY</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800/50">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Current Action</div>
              <div className="text-sm font-bold text-white truncate">{gameState.recentEvent}</div>
            </div>
            {gameState.isCommercialBreak && (
              <div className="flex-shrink-0 px-2 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black border border-amber-500/20 rounded uppercase animate-pulse">
                TV Timeout
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Intelligence Card */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all duration-500 p-6 ${prediction ? getStatusStyles(prediction.recommendation) : 'bg-slate-900 border-slate-800'}`}>
        {loading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Analyzing Game Flow...</span>
          </div>
        )}

        <div className="flex items-start gap-5">
          <div className={`p-4 rounded-2xl ${prediction?.recommendation === 'GO_NOW' ? 'bg-emerald-500/20 text-emerald-400' : prediction?.recommendation === 'WAIT' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-600/20 text-blue-400'}`}>
            {prediction?.recommendation === 'GO_NOW' ? <CheckCircle2 size={32} /> : prediction?.recommendation === 'WAIT' ? <AlertTriangle size={32} /> : <Zap size={32} className="animate-pulse" />}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60">Smart Break Analysis</h4>
              {prediction && (
                <div className="flex items-center gap-1.5">
                  <Timer size={12} />
                  <span className="text-[11px] font-black uppercase">{prediction.estimatedWindow} Window</span>
                </div>
              )}
            </div>
            
            {!prediction ? (
              <div className="py-2">
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                  Waiting for game progression to trigger break analysis...
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                  {prediction.recommendation.replace('_', ' ')}
                </h3>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  {prediction.reasoning}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Brain decoration */}
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <Volume2 size={120} />
        </div>
      </div>
      
      <div className="px-2">
        <button 
          onClick={() => setIsAutoSyncing(!isAutoSyncing)}
          className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isAutoSyncing ? 'text-emerald-500' : 'text-slate-500'}`}
        >
          {isAutoSyncing ? '● Live Feed Connected' : '○ Sync Paused'}
        </button>
      </div>
    </div>
  );
};

export default PitStopPredictor;

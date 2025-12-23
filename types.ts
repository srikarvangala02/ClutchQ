
export enum SportType {
  BASEBALL = 'Baseball',
  FOOTBALL = 'Football',
  SOCCER = 'Soccer',
  BASKETBALL = 'Basketball'
}

export enum LineStatus {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  UNKNOWN = 'Unknown'
}

export type VendorType = 'Food' | 'Drink' | 'Restroom' | 'Merchandise';

export interface Vendor {
  id: string;
  name: string;
  type: VendorType;
  section: string;
  currentWaitMinutes: number;
  lastUpdated: Date;
  reportsCount: number;
}

export interface GameState {
  sport: SportType;
  currentPeriod: string;
  timeRemaining: string;
  recentEvent: string;
  isCommercialBreak: boolean;
  score: { home: number; away: number };
  gamePhase: 'PRE' | 'LIVE' | 'BREAK' | 'FINAL';
}

export interface UserReward {
  points: number;
  level: string;
  history: { date: Date; points: number; action: string }[];
}

export interface PitStopPrediction {
  recommendation: 'GO_NOW' | 'WAIT' | 'URGENT';
  reasoning: string;
  estimatedWindow: string;
}

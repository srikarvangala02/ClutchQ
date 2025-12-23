
import React from 'react';
import { 
  Beer, 
  Pizza, 
  User, 
  ShoppingBag, 
  Timer, 
  AlertCircle,
  MapPin,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { SportType, Vendor } from './types';

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#f59e0b',
  danger: '#ef4444',
  background: '#0f172a',
  card: '#1e293b'
};

export const MOCK_VENDORS: Vendor[] = [
  { id: '1', name: 'Big League Burgers', type: 'Food', section: '102', currentWaitMinutes: 12, lastUpdated: new Date(), reportsCount: 45 },
  { id: '2', name: 'Craft Brews Alley', type: 'Drink', section: '115', currentWaitMinutes: 5, lastUpdated: new Date(), reportsCount: 22 },
  { id: '3', name: 'Main Concourse Restroom', type: 'Restroom', section: '105', currentWaitMinutes: 20, lastUpdated: new Date(), reportsCount: 130 },
  { id: '4', name: 'Team Store Express', type: 'Merchandise', section: 'Gate B', currentWaitMinutes: 8, lastUpdated: new Date(), reportsCount: 15 },
  { id: '5', name: 'Nacho Ordinary Stand', type: 'Food', section: '204', currentWaitMinutes: 3, lastUpdated: new Date(), reportsCount: 8 },
];

export const SPORT_ICONS = {
  [SportType.BASEBALL]: '⚾',
  [SportType.FOOTBALL]: '🏈',
  [SportType.SOCCER]: '⚽',
  [SportType.BASKETBALL]: '🏀'
};

export const VENDOR_ICONS = {
  'Food': <Pizza className="w-5 h-5" />,
  'Drink': <Beer className="w-5 h-5" />,
  'Restroom': <User className="w-5 h-5" />,
  'Merchandise': <ShoppingBag className="w-5 h-5" />
};

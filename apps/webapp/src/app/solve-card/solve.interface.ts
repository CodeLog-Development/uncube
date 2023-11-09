export interface Solve {
  millis: number;
  penalty?: SolvePenalty;
  timestamp: number;
  scramble: string;
  id?: string;
  syncIcon?: string;
}

export type SolvePenalty = 'dnf' | '+2';

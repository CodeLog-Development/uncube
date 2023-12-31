export interface Solve {
  millis: number;
  penalty?: SolvePenalty;
  timestamp: number;
  scramble: string;
}

export type SolvePenalty = 'dnf' | '+2';

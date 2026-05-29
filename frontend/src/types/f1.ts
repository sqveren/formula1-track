export interface Session {
  name: string;
  date: string;
  startTime: string;
}

export interface RaceWeekend {
  grandPrixName: string;
  circuitName: string;
  country: string;
  sessions: Session[];
}

export interface QualifyingResult {
  position: number;
  driver: string;
  team: string;
  q1: string;
  q2: string;
  q3: string;
}

export interface GridPosition {
  position: number;
  driver: string;
  team: string;
}

export interface RaceResult {
  position: number;
  driver: string;
  team: string;
  points: number;
}

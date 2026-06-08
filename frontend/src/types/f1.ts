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

export interface RaceCalendarItem {
  round: number;
  grandPrixName: string;
  circuitName: string;
  country: string;
  raceDate: string;
  sessions: Session[];
}

export interface QualifyingResult {
  position: number;
  driverId: string;
  teamId: string;
  driver: string;
  team: string;
  q1: string;
  q2: string;
  q3: string;
}

export interface GridPosition {
  position: number;
  driverId: string;
  teamId: string;
  driver: string;
  team: string;
}

export interface RaceResult {
  position: number;
  driverId: string;
  teamId: string;
  driver: string;
  team: string;
  points: number;
}

export interface DriverStanding {
  position: number;
  driverId: string;
  teamId: string;
  driver: string;
  team: string;
  points: number;
  wins: number;
}

export interface ConstructorStanding {
  position: number;
  teamId: string;
  team: string;
  points: number;
  wins: number;
}

export interface DriverDetails {
  driverId: string;
  driver: string;
  team: string;
  championshipPosition: number;
  points: number;
  wins: number;
  latestResult: string;
  nationality: string;
  seasonInformation: string;
}

export interface DriverAnalytics {
  driverId: string;
  driver: string;
  team: string;
  average_grid_position: number;
  average_finish_position: number;
  qualifying_race_delta: number;
  consistency: number;
  dnfs: number;
  points_per_race: number;
  podiums: number;
  form: string[];
}

export interface Circuit {
  round: number;
  grandPrixName: string;
  circuitName: string;
  country: string;
  raceDate: string;
  trackLength: string;
  numberOfLaps: number;
  raceDistance: string;
  firstGrandPrixYear: number;
}

export interface RaceInsight {
  driver: string;
  startingPosition: number;
  finishingPosition: number;
  positionsGained: number;
}

export interface RaceInsights {
  raceName: string;
  biggestGainer: RaceInsight;
  biggestLoser: RaceInsight;
}

export interface TeamDetails {
  teamId: string;
  team: string;
  championshipPosition: number;
  points: number;
  wins: number;
  drivers: string[];
  latestResults: string[];
}

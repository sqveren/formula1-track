import axios from "axios";

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

interface ApiResponse<T> {
  data: T;
}

export const apiClient = axios.create({
  baseURL: "http://localhost:8000",
});

export async function getWeekend(): Promise<RaceWeekend> {
  const response = await apiClient.get<ApiResponse<RaceWeekend>>("/weekend");
  return response.data.data;
}

export async function getQualifying(): Promise<QualifyingResult[]> {
  const response =
    await apiClient.get<ApiResponse<QualifyingResult[]>>("/qualifying");
  return response.data.data;
}

export async function getGrid(): Promise<GridPosition[]> {
  const response = await apiClient.get<ApiResponse<GridPosition[]>>("/grid");
  return response.data.data;
}

export async function getResults(): Promise<RaceResult[]> {
  const response = await apiClient.get<ApiResponse<RaceResult[]>>("/results");
  return response.data.data;
}

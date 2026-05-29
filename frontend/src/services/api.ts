import axios from "axios";

import type {
  GridPosition,
  QualifyingResult,
  RaceResult,
  RaceWeekend,
} from "../types/f1";

export type {
  GridPosition,
  QualifyingResult,
  RaceResult,
  RaceWeekend,
  Session,
} from "../types/f1";

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

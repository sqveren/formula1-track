import axios from "axios";

import type {
  Circuit,
  ConstructorStanding,
  DriverAnalytics,
  DriverDetails,
  DriverStanding,
  GridPosition,
  QualifyingResult,
  RaceCalendarItem,
  RaceInsight,
  RaceInsights,
  RaceResult,
  RaceWeekend,
  TeamDetails,
} from "../types/f1";

export type {
  Circuit,
  ConstructorStanding,
  DriverAnalytics,
  DriverDetails,
  DriverStanding,
  GridPosition,
  QualifyingResult,
  RaceCalendarItem,
  RaceInsight,
  RaceInsights,
  RaceResult,
  RaceWeekend,
  Session,
  TeamDetails,
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

export async function getCalendar(): Promise<RaceCalendarItem[]> {
  const response = await apiClient.get<ApiResponse<RaceCalendarItem[]>>(
    "/calendar",
  );
  return response.data.data;
}

export async function getCircuits(): Promise<Circuit[]> {
  const response = await apiClient.get<ApiResponse<Circuit[]>>("/circuits");
  return response.data.data;
}

export async function getCircuit(circuitName: string): Promise<Circuit> {
  const response = await apiClient.get<ApiResponse<Circuit>>(
    `/circuits/${encodeURIComponent(circuitName)}`,
  );
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

export async function getDriverStandings(): Promise<DriverStanding[]> {
  const response =
    await apiClient.get<ApiResponse<DriverStanding[]>>("/driver-standings");
  return response.data.data;
}

export async function getConstructorStandings(): Promise<
  ConstructorStanding[]
> {
  const response = await apiClient.get<ApiResponse<ConstructorStanding[]>>(
    "/constructor-standings",
  );
  return response.data.data;
}

export async function getRaceInsights(): Promise<RaceInsights> {
  const response =
    await apiClient.get<ApiResponse<RaceInsights>>("/race-insights");
  return response.data.data;
}

export async function getDriverDetails(driverId: string): Promise<DriverDetails> {
  const response = await apiClient.get<ApiResponse<DriverDetails>>(
    `/driver/${driverId}`,
  );
  return response.data.data;
}

export async function getDriverAnalytics(
  driverId: string,
): Promise<DriverAnalytics> {
  const response = await apiClient.get<ApiResponse<DriverAnalytics>>(
    `/driver/${driverId}/analytics`,
  );
  return response.data.data;
}

export async function getTeamDetails(teamId: string): Promise<TeamDetails> {
  const response = await apiClient.get<ApiResponse<TeamDetails>>(
    `/team/${teamId}`,
  );
  return response.data.data;
}

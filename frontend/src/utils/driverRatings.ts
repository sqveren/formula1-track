import type { DriverAnalytics } from "../services/api";

export interface DriverRating {
  label: string;
  value: number;
}

export function buildDriverRatings(analytics: DriverAnalytics): DriverRating[] {
  const averageQualifyingPosition =
    analytics.average_finish_position + analytics.qualifying_race_delta;
  const overtakingBase = 50 + analytics.qualifying_race_delta * 8;

  return [
    {
      label: "PACE",
      value: scoreFromPosition(analytics.average_grid_position),
    },
    {
      label: "QUALIFYING",
      value: scoreFromPosition(averageQualifyingPosition),
    },
    {
      label: "RACE CRAFT",
      value: scoreFromPosition(analytics.average_finish_position),
    },
    {
      label: "CONSISTENCY",
      value: clampRating(100 - analytics.consistency * 12),
    },
    {
      label: "OVERTAKING",
      value: clampRating(overtakingBase),
    },
  ];
}

function scoreFromPosition(position: number) {
  if (position <= 0) {
    return 0;
  }

  return clampRating(100 - (position - 1) * 4.5);
}

function clampRating(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

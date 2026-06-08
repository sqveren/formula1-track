import { useEffect, useState } from "react";

import {
  getDriverAnalytics,
  getDriverDetails,
  type DriverAnalytics,
  type DriverDetails,
} from "../services/api";
import Modal from "./Modal";

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string | null;
}

function DriverDetailsModal({
  isOpen,
  onClose,
  driverId,
}: DriverDetailsModalProps) {
  const [details, setDetails] = useState<DriverDetails | null>(null);
  const [analytics, setAnalytics] = useState<DriverAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !driverId) {
      setDetails(null);
      setAnalytics(null);
      return;
    }

    let isActive = true;
    const currentDriverId = driverId;

    async function loadDetails() {
      try {
        setIsLoading(true);
        setError(null);
        setAnalyticsError(null);
        const [detailsResult, analyticsResult] = await Promise.allSettled([
          getDriverDetails(currentDriverId),
          getDriverAnalytics(currentDriverId),
        ]);

        if (!isActive) {
          return;
        }

        if (detailsResult.status === "fulfilled") {
          setDetails(detailsResult.value);
        } else {
          setError("Unable to load driver details.");
        }

        if (analyticsResult.status === "fulfilled") {
          setAnalytics(analyticsResult.value);
        } else {
          setAnalyticsError("Unable to load driver analytics.");
        }
      } catch {
        if (isActive) {
          setError("Unable to load driver details.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      isActive = false;
    };
  }, [isOpen, driverId]);

  if (!isOpen || !driverId) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={details?.driver ?? "Driver Details"}
      isLoading={isLoading}
      error={error}
    >
      {details ? (
        <div className="space-y-5">
          <section className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium uppercase text-slate-400">
              Season Stats
            </p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-4">
              <StatItem label="Wins" value={details.wins} />
              <StatItem label="Points" value={details.points} />
              <StatItem label="Podiums" value={analytics?.podiums ?? 0} />
              <StatItem label="DNFs" value={analytics?.dnfs ?? 0} />
            </dl>
          </section>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-400">Team</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.team || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Nationality
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.nationality || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Championship Position
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.championshipPosition || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Points</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.points}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Wins</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.wins}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Latest Result
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.latestResult || "Not available yet"}
              </dd>
            </div>
          </dl>

          {details.seasonInformation && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-sm text-slate-300">
                {details.seasonInformation}
              </p>
            </div>
          )}

          {analyticsError ? (
            <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
              {analyticsError}
            </div>
          ) : analytics ? (
            <>
              <section className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium uppercase text-slate-400">
                  FIFA Style Attributes
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {buildDriverAttributes(analytics).map((attribute) => (
                    <AttributeRow
                      key={attribute.label}
                      label={attribute.label}
                      value={attribute.value}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium uppercase text-slate-400">
                  Performance Metrics
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <StatItem
                    label="Average Grid"
                    value={analytics.average_grid_position}
                  />
                  <StatItem
                    label="Average Finish"
                    value={analytics.average_finish_position}
                  />
                  <StatItem
                    label="Qualifying vs Race"
                    value={analytics.qualifying_race_delta}
                  />
                  <StatItem label="Consistency" value={analytics.consistency} />
                  <StatItem
                    label="Points Per Race"
                    value={analytics.points_per_race}
                  />
                </dl>
              </section>

              <section className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                <p className="text-sm font-medium uppercase text-slate-400">
                  Trend
                </p>
                {analytics.form.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analytics.form.map((result, index) => (
                      <span
                        key={`${result}-${index}`}
                        className="rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-100"
                      >
                        {result}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-300">
                    Not available yet
                  </p>
                )}
              </section>
            </>
          ) : null}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Not available yet
        </div>
      )}
    </Modal>
  );
}

interface StatItemProps {
  label: string;
  value: number | string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

interface AttributeRowProps {
  label: string;
  value: number;
}

function AttributeRow({ label, value }: AttributeRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-800 bg-slate-900 p-3">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <span className="text-xl font-semibold text-white">{value}</span>
    </div>
  );
}

function buildDriverAttributes(analytics: DriverAnalytics) {
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

export default DriverDetailsModal;

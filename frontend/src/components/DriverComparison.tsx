import { useEffect, useMemo, useState } from "react";

import {
  getDriverAnalytics,
  type DriverAnalytics,
  type DriverStanding,
} from "../services/api";
import { buildDriverRatings } from "../utils/driverRatings";

interface DriverComparisonProps {
  drivers: DriverStanding[];
}

function DriverComparison({ drivers }: DriverComparisonProps) {
  const [driverAId, setDriverAId] = useState("");
  const [driverBId, setDriverBId] = useState("");
  const [driverAAnalytics, setDriverAAnalytics] =
    useState<DriverAnalytics | null>(null);
  const [driverBAnalytics, setDriverBAnalytics] =
    useState<DriverAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const driverA = useMemo(
    () => drivers.find((driver) => driver.driverId === driverAId),
    [driverAId, drivers],
  );
  const driverB = useMemo(
    () => drivers.find((driver) => driver.driverId === driverBId),
    [driverBId, drivers],
  );

  useEffect(() => {
    if (!driverAId && !driverBId) {
      setDriverAAnalytics(null);
      setDriverBAnalytics(null);
      return;
    }

    let isActive = true;

    async function loadAnalytics() {
      try {
        setIsLoading(true);
        setError(null);

        const [driverAResult, driverBResult] = await Promise.allSettled([
          driverAId ? getDriverAnalytics(driverAId) : Promise.resolve(null),
          driverBId ? getDriverAnalytics(driverBId) : Promise.resolve(null),
        ]);

        if (!isActive) {
          return;
        }

        if (driverAResult.status === "fulfilled") {
          setDriverAAnalytics(driverAResult.value);
        }

        if (driverBResult.status === "fulfilled") {
          setDriverBAnalytics(driverBResult.value);
        }

        if (
          driverAResult.status === "rejected" ||
          driverBResult.status === "rejected"
        ) {
          setError("Unable to load driver analytics.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      isActive = false;
    };
  }, [driverAId, driverBId]);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">Compare Drivers</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DriverSelect
          label="Driver A"
          value={driverAId}
          drivers={drivers}
          onChange={setDriverAId}
        />
        <DriverSelect
          label="Driver B"
          value={driverBId}
          drivers={drivers}
          onChange={setDriverBId}
        />
      </div>

      {isLoading ? (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Loading comparison...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
          {error}
        </div>
      ) : driverAAnalytics || driverBAnalytics ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <DriverComparisonCard
            standing={driverA}
            analytics={driverAAnalytics}
          />
          <DriverComparisonCard
            standing={driverB}
            analytics={driverBAnalytics}
          />
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Select two drivers to compare.
        </div>
      )}
    </section>
  );
}

interface DriverSelectProps {
  label: string;
  value: string;
  drivers: DriverStanding[];
  onChange: (value: string) => void;
}

function DriverSelect({ label, value, drivers, onChange }: DriverSelectProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      >
        <option value="">Select driver</option>
        {drivers.map((driver) => (
          <option key={driver.driverId} value={driver.driverId}>
            {driver.driver}
          </option>
        ))}
      </select>
    </label>
  );
}

interface DriverComparisonCardProps {
  standing?: DriverStanding;
  analytics: DriverAnalytics | null;
}

function DriverComparisonCard({
  standing,
  analytics,
}: DriverComparisonCardProps) {
  if (!standing && !analytics) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
        No driver selected.
      </div>
    );
  }

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <h3 className="text-base font-semibold text-white">
        {standing?.driver ?? analytics?.driver}
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        {standing?.team ?? analytics?.team}
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="Championship" value={standing?.position ?? "-"} />
        <Metric label="Points" value={standing?.points ?? "-"} />
        <Metric label="Wins" value={standing?.wins ?? "-"} />
        <Metric label="Podiums" value={analytics?.podiums ?? "-"} />
        <Metric
          label="Average Grid"
          value={analytics?.average_grid_position ?? "-"}
        />
        <Metric
          label="Average Finish"
          value={analytics?.average_finish_position ?? "-"}
        />
        <Metric
          label="Points / Race"
          value={analytics?.points_per_race ?? "-"}
        />
        <Metric label="Consistency" value={analytics?.consistency ?? "-"} />
        <Metric
          label="Quali vs Race"
          value={analytics?.qualifying_race_delta ?? "-"}
        />
      </dl>

      {analytics ? (
        <div className="mt-4 grid gap-2">
          {buildDriverRatings(analytics).map((rating) => (
            <div
              key={rating.label}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
            >
              <span className="text-sm text-slate-300">{rating.label}</span>
              <span className="text-lg font-semibold text-white">
                {rating.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

interface MetricProps {
  label: string;
  value: number | string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

export default DriverComparison;

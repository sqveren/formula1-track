import { useEffect, useState } from "react";

import { getRaceInsights, type RaceInsight, type RaceInsights } from "../services/api";

function RaceInsightCard() {
  const [insights, setInsights] = useState<RaceInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadInsights() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getRaceInsights();

        if (isActive) {
          setInsights(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load race insights.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadInsights();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">Race Insights</h2>
      {isLoading ? (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Loading insights...
        </div>
      ) : error ? (
        <div className="mt-5 rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
          {error}
        </div>
      ) : insights ? (
        <div className="mt-5">
          <p className="text-sm text-slate-400">{insights.raceName}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Insight title="Biggest Gainer" insight={insights.biggestGainer} />
            <Insight title="Biggest Loser" insight={insights.biggestLoser} />
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          No insights available.
        </div>
      )}
    </section>
  );
}

interface InsightProps {
  title: string;
  insight: RaceInsight;
}

function Insight({ title, insight }: InsightProps) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <p className="text-sm font-medium uppercase text-slate-400">{title}</p>
      <h3 className="mt-3 text-base font-semibold text-white">
        {insight.driver}
      </h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <Metric label="Start" value={`P${insight.startingPosition}`} />
        <Metric label="Finish" value={`P${insight.finishingPosition}`} />
        <Metric
          label="Change"
          value={`${insight.positionsGained > 0 ? "+" : ""}${
            insight.positionsGained
          }`}
        />
      </dl>
    </article>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <dt className="text-xs uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-100">{value}</dd>
    </div>
  );
}

export default RaceInsightCard;

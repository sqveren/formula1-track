import { useEffect, useState } from "react";

import QualifyingTable from "../components/QualifyingTable";
import RaceWeekendCard from "../components/RaceWeekendCard";
import SessionCard from "../components/SessionCard";
import {
  getQualifying,
  getWeekend,
  type QualifyingResult,
  type RaceWeekend,
} from "../services/api";

function DashboardPage() {
  const [weekend, setWeekend] = useState<RaceWeekend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qualifyingResults, setQualifyingResults] = useState<
    QualifyingResult[]
  >([]);
  const [isQualifyingLoading, setIsQualifyingLoading] = useState(true);
  const [qualifyingError, setQualifyingError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadWeekend() {
      try {
        setIsLoading(true);
        setError(null);
        const weekendData = await getWeekend();

        if (isActive) {
          setWeekend(weekendData);
        }
      } catch {
        if (isActive) {
          setError("Unable to load race weekend data.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWeekend();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadQualifying() {
      try {
        setIsQualifyingLoading(true);
        setQualifyingError(null);
        const results = await getQualifying();

        if (isActive) {
          setQualifyingResults(results);
        }
      } catch {
        if (isActive) {
          setQualifyingError("Unable to load qualifying results.");
        }
      } finally {
        if (isActive) {
          setIsQualifyingLoading(false);
        }
      }
    }

    loadQualifying();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold tracking-normal sm:text-2xl">
            Formula Track
          </h1>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Race Weekend</h2>
          <div className="mt-5">
            {isLoading ? (
              <div className="min-h-48 rounded-lg border border-slate-800 bg-slate-950 p-5 text-slate-300">
                Loading race weekend...
              </div>
            ) : error ? (
              <div className="min-h-48 rounded-lg border border-red-900 bg-red-950/40 p-5 text-red-200">
                {error}
              </div>
            ) : weekend ? (
              <RaceWeekendCard weekend={weekend} />
            ) : (
              <div className="min-h-48 rounded-lg border border-slate-800 bg-slate-950 p-5 text-slate-300">
                No race weekend data available.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold">Session Schedule</h2>
          <div className="mt-5 grid gap-3">
            {isLoading ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
                Loading sessions...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
                {error}
              </div>
            ) : weekend && weekend.sessions.length > 0 ? (
              weekend.sessions.map((session) => (
                <SessionCard
                  key={`${session.name}-${session.date}-${session.startTime}`}
                  session={session}
                />
              ))
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
                No sessions available.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Qualifying Results</h2>
          <div className="mt-5">
            {isQualifyingLoading ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 text-slate-300">
                Loading qualifying results...
              </div>
            ) : qualifyingError ? (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-5 text-red-200">
                {qualifyingError}
              </div>
            ) : qualifyingResults.length > 0 ? (
              <QualifyingTable results={qualifyingResults} />
            ) : (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-5 text-slate-300">
                No qualifying results available.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;

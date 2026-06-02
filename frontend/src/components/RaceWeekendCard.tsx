import type { RaceWeekend } from "../services/api";

interface RaceWeekendCardProps {
  weekend: RaceWeekend;
}

function RaceWeekendCard({ weekend }: RaceWeekendCardProps) {
  const raceSession =
    weekend.sessions.find((session) => session.name === "Race") ??
    weekend.sessions[0];

  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950 p-5">
      <h2 className="text-xl font-semibold text-white sm:text-2xl">
        {weekend.grandPrixName}
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-slate-400">Circuit</dt>
          <dd className="mt-1 text-base text-slate-100">
            {weekend.circuitName}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-400">Country</dt>
          <dd className="mt-1 text-base text-slate-100">{weekend.country}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-slate-400">Date/time</dt>
          <dd className="mt-1 text-base text-slate-100">
            {raceSession
              ? `${raceSession.date} ${raceSession.startTime}`
              : "Not available yet"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default RaceWeekendCard;

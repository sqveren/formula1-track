import type { RaceWeekend } from "../services/api";

interface RaceWeekendCardProps {
  weekend: RaceWeekend;
}

function RaceWeekendCard({ weekend }: RaceWeekendCardProps) {
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
      </dl>
    </article>
  );
}

export default RaceWeekendCard;

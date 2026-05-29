import type { Session } from "../services/api";

interface SessionCardProps {
  session: Session;
}

function SessionCard({ session }: SessionCardProps) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <h3 className="text-base font-semibold text-white">{session.name}</h3>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="font-medium text-slate-400">Date</p>
          <p className="mt-1 text-slate-100">{session.date}</p>
        </div>
        <div>
          <p className="font-medium text-slate-400">Start</p>
          <p className="mt-1 text-slate-100">{session.startTime}</p>
        </div>
      </div>
    </article>
  );
}

export default SessionCard;

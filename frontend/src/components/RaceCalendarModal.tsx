import SessionCard from "./SessionCard";
import Modal from "./Modal";
import type { RaceCalendarItem } from "../types/f1";

interface RaceCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  race: RaceCalendarItem | null;
}

function RaceCalendarModal({
  isOpen,
  onClose,
  race,
}: RaceCalendarModalProps) {
  if (!race) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={race.grandPrixName}>
      <div className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-400">Circuit</dt>
            <dd className="mt-1 text-base text-slate-100">
              {race.circuitName}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-400">Country</dt>
            <dd className="mt-1 text-base text-slate-100">{race.country}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-400">Round</dt>
            <dd className="mt-1 text-base text-slate-100">{race.round}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-400">Race Date</dt>
            <dd className="mt-1 text-base text-slate-100">{race.raceDate}</dd>
          </div>
        </dl>

        <div>
          <h3 className="text-base font-semibold text-white">
            Session Schedule
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {race.sessions && race.sessions.length > 0 ? (
              race.sessions.map((session) => (
                <SessionCard
                  key={`${session.name}-${session.date}-${session.startTime}`}
                  session={session}
                />
              ))
            ) : (
              <div className="col-span-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-slate-300">
                Not available yet
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RaceCalendarModal;

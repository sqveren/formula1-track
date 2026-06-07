import type { RaceCalendarItem } from "../services/api";

interface RaceCalendarCardProps {
  race: RaceCalendarItem;
  onSelect: (race: RaceCalendarItem) => void;
}

function RaceCalendarCard({ race, onSelect }: RaceCalendarCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(race)}
      className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left hover:border-slate-600 hover:bg-slate-900"
    >
      <p className="text-sm font-medium text-slate-400">Round {race.round}</p>
      <h3 className="mt-2 text-base font-semibold text-white">
        {race.grandPrixName}
      </h3>
      <p className="mt-2 text-sm text-slate-300">{race.circuitName}</p>
      <p className="mt-1 text-sm text-slate-400">
        {race.country} - {race.raceDate}
      </p>
    </button>
  );
}

export default RaceCalendarCard;

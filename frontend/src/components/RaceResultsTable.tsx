import type { RaceResult } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface RaceResultsTableProps {
  results: RaceResult[];
  onDriverSelect?: (driverId: string) => void;
  onTeamSelect?: (teamId: string) => void;
}

function RaceResultsTable({
  results,
  onDriverSelect,
  onTeamSelect,
}: RaceResultsTableProps) {
  const columns: TableColumn<RaceResult>[] = [
    {
      key: "position",
      header: "Position",
      render: (result) => result.position,
      className: "font-medium",
    },
    {
      key: "driver",
      header: "Driver",
      render: (result) =>
        result.driverId && onDriverSelect ? (
          <button
            type="button"
            onClick={() => onDriverSelect(result.driverId)}
            className="font-medium text-slate-100 hover:text-white hover:underline"
          >
            {result.driver}
          </button>
        ) : (
          result.driver
        ),
    },
    {
      key: "team",
      header: "Team",
      render: (result) =>
        result.teamId && onTeamSelect ? (
          <button
            type="button"
            onClick={() => onTeamSelect(result.teamId)}
            className="text-slate-300 hover:text-white hover:underline"
          >
            {result.team}
          </button>
        ) : (
          result.team
        ),
      className: "text-slate-300",
    },
    {
      key: "points",
      header: "Points",
      render: (result) => result.points,
    },
  ];

  return (
    <Table
      columns={columns}
      rows={results}
      getRowKey={(result) => `${result.position}-${result.driver}`}
    />
  );
}

export default RaceResultsTable;

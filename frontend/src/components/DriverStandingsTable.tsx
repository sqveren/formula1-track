import type { DriverStanding } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface DriverStandingsTableProps {
  standings: DriverStanding[];
  onDriverSelect?: (driverId: string) => void;
  onTeamSelect?: (teamId: string) => void;
}

function DriverStandingsTable({
  standings,
  onDriverSelect,
  onTeamSelect,
}: DriverStandingsTableProps) {
  const columns: TableColumn<DriverStanding>[] = [
    {
      key: "position",
      header: "Position",
      render: (standing) => standing.position,
      className: "font-medium",
    },
    {
      key: "driver",
      header: "Driver",
      render: (standing) =>
        standing.driverId && onDriverSelect ? (
          <button
            type="button"
            onClick={() => onDriverSelect(standing.driverId)}
            className="font-medium text-slate-100 hover:text-white hover:underline"
          >
            {standing.driver}
          </button>
        ) : (
          standing.driver
        ),
    },
    {
      key: "team",
      header: "Team",
      render: (standing) =>
        standing.teamId && onTeamSelect ? (
          <button
            type="button"
            onClick={() => onTeamSelect(standing.teamId)}
            className="text-slate-300 hover:text-white hover:underline"
          >
            {standing.team}
          </button>
        ) : (
          standing.team
        ),
      className: "text-slate-300",
    },
    {
      key: "points",
      header: "Points",
      render: (standing) => standing.points,
    },
    {
      key: "wins",
      header: "Wins",
      render: (standing) => standing.wins,
    },
  ];

  return (
    <Table
      columns={columns}
      rows={standings}
      getRowKey={(standing) => `${standing.position}-${standing.driver}`}
    />
  );
}

export default DriverStandingsTable;

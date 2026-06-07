import type { ConstructorStanding } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface ConstructorStandingsTableProps {
  standings: ConstructorStanding[];
  onTeamSelect?: (teamId: string) => void;
}

function ConstructorStandingsTable({
  standings,
  onTeamSelect,
}: ConstructorStandingsTableProps) {
  const columns: TableColumn<ConstructorStanding>[] = [
    {
      key: "position",
      header: "Position",
      render: (standing) => standing.position,
      className: "font-medium",
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
      getRowKey={(standing) => `${standing.position}-${standing.team}`}
    />
  );
}

export default ConstructorStandingsTable;

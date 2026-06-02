import type { ConstructorStanding } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface ConstructorStandingsTableProps {
  standings: ConstructorStanding[];
}

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
    render: (standing) => standing.team,
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

function ConstructorStandingsTable({
  standings,
}: ConstructorStandingsTableProps) {
  return (
    <Table
      columns={columns}
      rows={standings}
      getRowKey={(standing) => `${standing.position}-${standing.team}`}
    />
  );
}

export default ConstructorStandingsTable;

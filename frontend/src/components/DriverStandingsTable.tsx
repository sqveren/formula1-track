import type { DriverStanding } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface DriverStandingsTableProps {
  standings: DriverStanding[];
}

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
    render: (standing) => standing.driver,
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

function DriverStandingsTable({ standings }: DriverStandingsTableProps) {
  return (
    <Table
      columns={columns}
      rows={standings}
      getRowKey={(standing) => `${standing.position}-${standing.driver}`}
    />
  );
}

export default DriverStandingsTable;

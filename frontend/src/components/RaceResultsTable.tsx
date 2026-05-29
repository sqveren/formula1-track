import type { RaceResult } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface RaceResultsTableProps {
  results: RaceResult[];
}

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
    render: (result) => result.driver,
  },
  {
    key: "team",
    header: "Team",
    render: (result) => result.team,
    className: "text-slate-300",
  },
  {
    key: "points",
    header: "Points",
    render: (result) => result.points,
  },
];

function RaceResultsTable({ results }: RaceResultsTableProps) {
  return (
    <Table
      columns={columns}
      rows={results}
      getRowKey={(result) => `${result.position}-${result.driver}`}
    />
  );
}

export default RaceResultsTable;

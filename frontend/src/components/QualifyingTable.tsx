import type { QualifyingResult } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface QualifyingTableProps {
  results: QualifyingResult[];
}

const columns: TableColumn<QualifyingResult>[] = [
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
    key: "q1",
    header: "Q1",
    render: (result) => result.q1,
  },
  {
    key: "q2",
    header: "Q2",
    render: (result) => result.q2,
  },
  {
    key: "q3",
    header: "Q3",
    render: (result) => result.q3,
  },
];

function QualifyingTable({ results }: QualifyingTableProps) {
  return (
    <Table
      columns={columns}
      rows={results}
      getRowKey={(result) => `${result.position}-${result.driver}`}
    />
  );
}

export default QualifyingTable;

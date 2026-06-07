import type { QualifyingResult } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface QualifyingTableProps {
  results: QualifyingResult[];
  onDriverSelect?: (driverId: string) => void;
  onTeamSelect?: (teamId: string) => void;
}

function QualifyingTable({
  results,
  onDriverSelect,
  onTeamSelect,
}: QualifyingTableProps) {
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

  return (
    <Table
      columns={columns}
      rows={results}
      getRowKey={(result) => `${result.position}-${result.driver}`}
    />
  );
}

export default QualifyingTable;

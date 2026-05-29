import type { GridPosition } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface GridTableProps {
  positions: GridPosition[];
}

const columns: TableColumn<GridPosition>[] = [
  {
    key: "position",
    header: "Position",
    render: (position) => position.position,
    className: "font-medium",
  },
  {
    key: "driver",
    header: "Driver",
    render: (position) => position.driver,
  },
  {
    key: "team",
    header: "Team",
    render: (position) => position.team,
    className: "text-slate-300",
  },
];

function GridTable({ positions }: GridTableProps) {
  return (
    <Table
      columns={columns}
      rows={positions}
      getRowKey={(position) => `${position.position}-${position.driver}`}
    />
  );
}

export default GridTable;

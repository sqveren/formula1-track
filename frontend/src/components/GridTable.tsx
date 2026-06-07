import type { GridPosition } from "../services/api";
import Table, { type TableColumn } from "./Table";

interface GridTableProps {
  positions: GridPosition[];
  onDriverSelect?: (driverId: string) => void;
  onTeamSelect?: (teamId: string) => void;
}

function GridTable({
  positions,
  onDriverSelect,
  onTeamSelect,
}: GridTableProps) {
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
      render: (position) =>
        position.driverId && onDriverSelect ? (
          <button
            type="button"
            onClick={() => onDriverSelect(position.driverId)}
            className="font-medium text-slate-100 hover:text-white hover:underline"
          >
            {position.driver}
          </button>
        ) : (
          position.driver
        ),
    },
    {
      key: "team",
      header: "Team",
      render: (position) =>
        position.teamId && onTeamSelect ? (
          <button
            type="button"
            onClick={() => onTeamSelect(position.teamId)}
            className="text-slate-300 hover:text-white hover:underline"
          >
            {position.team}
          </button>
        ) : (
          position.team
        ),
      className: "text-slate-300",
    },
  ];

  return (
    <Table
      columns={columns}
      rows={positions}
      getRowKey={(position) => `${position.position}-${position.driver}`}
    />
  );
}

export default GridTable;

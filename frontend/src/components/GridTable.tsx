import type { GridPosition } from "../services/api";

interface GridTableProps {
  positions: GridPosition[];
}

function GridTable({ positions }: GridTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead className="bg-slate-900 text-xs uppercase text-slate-400">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Position
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Driver
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Team
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-100">
          {positions.map((position) => (
            <tr key={`${position.position}-${position.driver}`}>
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {position.position}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {position.driver}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                {position.team}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GridTable;

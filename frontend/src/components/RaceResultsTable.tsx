import type { RaceResult } from "../services/api";

interface RaceResultsTableProps {
  results: RaceResult[];
}

function RaceResultsTable({ results }: RaceResultsTableProps) {
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
            <th scope="col" className="px-4 py-3 font-semibold">
              Points
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-100">
          {results.map((result) => (
            <tr key={`${result.position}-${result.driver}`}>
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {result.position}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{result.driver}</td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                {result.team}
              </td>
              <td className="whitespace-nowrap px-4 py-3">{result.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RaceResultsTable;

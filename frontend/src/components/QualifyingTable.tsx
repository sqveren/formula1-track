import type { QualifyingResult } from "../services/api";

interface QualifyingTableProps {
  results: QualifyingResult[];
}

function QualifyingTable({ results }: QualifyingTableProps) {
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
              Q1
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Q2
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Q3
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
              <td className="whitespace-nowrap px-4 py-3">{result.q1}</td>
              <td className="whitespace-nowrap px-4 py-3">{result.q2}</td>
              <td className="whitespace-nowrap px-4 py-3">{result.q3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QualifyingTable;

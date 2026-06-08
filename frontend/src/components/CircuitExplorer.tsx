import { useEffect, useState } from "react";

import { getCircuits, type Circuit } from "../services/api";
import CircuitDetailsModal from "./CircuitDetailsModal";

function CircuitExplorer() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCircuits() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCircuits();

        if (isActive) {
          setCircuits(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load circuits.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadCircuits();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold text-white">Circuit Explorer</h2>
      <div className="mt-5">
        {isLoading ? (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
            Loading circuits...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
            {error}
          </div>
        ) : circuits.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {circuits.map((circuit) => (
              <button
                key={`${circuit.round}-${circuit.circuitName}`}
                type="button"
                onClick={() => setSelectedCircuit(circuit)}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-sm font-medium text-slate-400">
                  Round {circuit.round}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white">
                  {circuit.grandPrixName}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  {circuit.circuitName}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {circuit.country} - {circuit.raceDate}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
            No circuits available.
          </div>
        )}
      </div>

      <CircuitDetailsModal
        isOpen={selectedCircuit !== null}
        onClose={() => setSelectedCircuit(null)}
        circuit={selectedCircuit}
      />
    </section>
  );
}

export default CircuitExplorer;

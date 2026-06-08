import Modal from "./Modal";
import type { Circuit } from "../services/api";

interface CircuitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuit: Circuit | null;
}

function CircuitDetailsModal({
  isOpen,
  onClose,
  circuit,
}: CircuitDetailsModalProps) {
  if (!circuit) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={circuit.circuitName}>
      <div className="space-y-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Detail label="Grand Prix" value={circuit.grandPrixName} />
          <Detail label="Country" value={circuit.country} />
          <Detail label="Race Date" value={circuit.raceDate} />
          <Detail label="Track Length" value={circuit.trackLength} />
          <Detail label="Number of Laps" value={circuit.numberOfLaps} />
          <Detail label="Race Distance" value={circuit.raceDistance} />
          <Detail
            label="First Grand Prix"
            value={circuit.firstGrandPrixYear || "Not available yet"}
          />
        </dl>
      </div>
    </Modal>
  );
}

interface DetailProps {
  label: string;
  value: number | string;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className="mt-1 text-base text-slate-100">{value}</dd>
    </div>
  );
}

export default CircuitDetailsModal;

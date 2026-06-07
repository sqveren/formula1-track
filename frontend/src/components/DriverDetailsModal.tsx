import { useEffect, useState } from "react";

import { getDriverDetails, type DriverDetails } from "../services/api";
import Modal from "./Modal";

interface DriverDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string | null;
}

function DriverDetailsModal({
  isOpen,
  onClose,
  driverId,
}: DriverDetailsModalProps) {
  const [details, setDetails] = useState<DriverDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !driverId) {
      setDetails(null);
      return;
    }

    let isActive = true;
    const currentDriverId = driverId;

    async function loadDetails() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDriverDetails(currentDriverId);

        if (isActive) {
          setDetails(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load driver details.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      isActive = false;
    };
  }, [isOpen, driverId]);

  if (!isOpen || !driverId) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={details?.driver ?? "Driver Details"}
      isLoading={isLoading}
      error={error}
    >
      {details ? (
        <div className="space-y-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-400">Team</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.team || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Nationality
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.nationality || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Championship Position
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.championshipPosition || "Not available yet"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Points</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.points}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">Wins</dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.wins}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-400">
                Latest Result
              </dt>
              <dd className="mt-1 text-base text-slate-100">
                {details.latestResult || "Not available yet"}
              </dd>
            </div>
          </dl>

          {details.seasonInformation && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-sm text-slate-300">
                {details.seasonInformation}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Not available yet
        </div>
      )}
    </Modal>
  );
}

export default DriverDetailsModal;

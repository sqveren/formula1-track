import { useEffect, useState } from "react";

import { getTeamDetails, type TeamDetails } from "../services/api";
import Modal from "./Modal";

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | null;
}

function TeamDetailsModal({ isOpen, onClose, teamId }: TeamDetailsModalProps) {
  const [details, setDetails] = useState<TeamDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !teamId) {
      setDetails(null);
      return;
    }

    let isActive = true;
    const currentTeamId = teamId;

    async function loadDetails() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getTeamDetails(currentTeamId);

        if (isActive) {
          setDetails(data);
        }
      } catch {
        if (isActive) {
          setError("Unable to load team details.");
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
  }, [isOpen, teamId]);

  if (!isOpen || !teamId) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={details?.team ?? "Team Details"}
      isLoading={isLoading}
      error={error}
    >
      {details ? (
        <div className="space-y-5">
          <dl className="grid gap-4 sm:grid-cols-2">
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
              <dd className="mt-1 text-base text-slate-100">{details.wins}</dd>
            </div>
          </dl>

          <section>
            <h3 className="text-base font-semibold text-white">Drivers</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {details.drivers.map((driver) => (
                <li
                  key={driver}
                  className="rounded-md border border-slate-800 bg-slate-950 p-3"
                >
                  {driver}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white">
              Latest Results
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {details.latestResults.map((result) => (
                <li
                  key={result}
                  className="rounded-md border border-slate-800 bg-slate-950 p-3"
                >
                  {result}
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Not available yet
        </div>
      )}
    </Modal>
  );
}

export default TeamDetailsModal;

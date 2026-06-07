import { useEffect, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  isLoading = false,
  error = null,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6"
      onClick={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-slate-800 bg-slate-900 p-5 text-slate-100 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-300">
              Loading...
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
              {error}
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    </div>
  );
}

export default Modal;

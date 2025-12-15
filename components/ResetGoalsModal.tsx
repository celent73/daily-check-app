import React from 'react';

interface ResetGoalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetGoalsModal: React.FC<ResetGoalsModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="reset-goals-modal-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 id="reset-goals-modal-title" className="text-2xl font-bold text-slate-800">🎉 Nuovo Mese Commerciale!</h2>
        </div>
        <div className="p-6 text-slate-600 space-y-4">
          <p>
            È iniziato un nuovo periodo di lavoro. Questo è il momento perfetto per rivedere e aggiornare i tuoi obiettivi.
          </p>
          <p className="font-medium">
            Vuoi reimpostare i tuoi target giornalieri, settimanali e mensili per ripartire con una nuova sfida?
          </p>
          <p className="text-sm text-slate-500">
            (Non preoccuparti, il tuo profilo e lo storico delle attività non verranno modificati.)
          </p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Mantieni Obiettivi Attuali
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sì, Reimposta Obiettivi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetGoalsModal;
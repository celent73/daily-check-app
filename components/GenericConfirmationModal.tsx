import React from 'react';

interface GenericConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

const GenericConfirmationModal: React.FC<GenericConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Conferma',
  cancelButtonText = 'Annulla'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="generic-modal-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
          <h2 id="generic-modal-title" className="text-xl font-bold text-slate-800">{title}</h2>
        </div>
        <div className="p-6 text-slate-600 space-y-4">
          {message}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenericConfirmationModal;
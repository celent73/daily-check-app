
import React from 'react';
import { ActivityLog } from '../types';

interface EditLogModalProps {
    isOpen: boolean;
    onClose: () => void;
    log: ActivityLog | null;
    onSave: (log: ActivityLog) => void;
    customLabels: Record<string, string>;
}

const EditLogModal: React.FC<EditLogModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl">
                <h2 className="text-lg font-bold">Modifica Attività</h2>
                <p>Funzionalità in manutenzione.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Chiudi</button>
            </div>
        </div>
    );
};

export default EditLogModal;

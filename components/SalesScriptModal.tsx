
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SalesScriptModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl max-w-sm w-full">
                <h2 className="text-xl font-bold dark:text-white mb-2">Script Vendita</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Script presto disponibili!</p>
                <button onClick={onClose} className="w-full py-2 bg-slate-600 text-white rounded-lg">Chiudi</button>
            </div>
        </div>
    );
};

export default SalesScriptModal;

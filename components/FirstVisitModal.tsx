
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface FirstVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveProfile: (profile: UserProfile) => void;
}

const FirstVisitModal: React.FC<FirstVisitModalProps> = ({ isOpen, onClose, onSaveProfile }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-xl w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">Benvenuto!</h2>
                <input
                    className="w-full border p-2 rounded mb-4"
                    placeholder="Il tuo nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <button
                    onClick={() => onSaveProfile({ firstName: name, lastName: '', commissionStatus: 'privilegiato' })}
                    className="w-full bg-blue-600 text-white py-2 rounded"
                >
                    Inizia
                </button>
            </div>
        </div>
    );
};

export default FirstVisitModal;

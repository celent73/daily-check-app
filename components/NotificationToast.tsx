
import React from 'react';
import { NotificationVariant } from '../types';

interface NotificationToastProps {
    message: string;
    type: NotificationVariant;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    return (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg z-[100] flex items-center gap-3 animate-bounce-in`}>
            <span>{message}</span>
            <button onClick={onClose} className="font-bold opacity-70 hover:opacity-100">X</button>
        </div>
    );
};

export default NotificationToast;

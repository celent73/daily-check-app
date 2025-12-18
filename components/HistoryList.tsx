
import React from 'react';
import { ActivityLog, NotificationVariant } from '../types';

interface HistoryListProps {
    logs: ActivityLog[];
    customLabels: Record<string, string>;
    onDeleteLog: (id: string) => void;
    onEditLog: (log: ActivityLog) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ logs, customLabels, onDeleteLog, onEditLog }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold dark:text-white">Storico Attività</h2>
            {logs.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">Nessuna attività registrata.</p>
            ) : (
                logs.map(log => (
                    <div key={log.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow flex justify-between items-center">
                        <div>
                            <p className="font-bold dark:text-white">{customLabels[log.type] || log.type}</p>
                            <p className="text-sm text-gray-500">{new Date(log.date).toLocaleString()}</p>
                            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded-full">x{log.count}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onEditLog(log)} className="text-blue-500">Edit</button>
                            <button onClick={() => onDeleteLog(log.id)} className="text-red-500">Del</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default HistoryList;


import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, VisionBoardData } from '../types';

interface VisionBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (visionData: VisionBoardData) => void;
  currentData: VisionBoardData | undefined;
  addNotification: (message: string, type: 'success' | 'info') => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ToggleSwitch: React.FC<{
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
  <div className="flex items-center justify-between group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border border-slate-100 dark:border-slate-700">
    <div>
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{label}</h4>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      className={`${
        enabled ? 'bg-purple-600' : 'bg-slate-200 dark:bg-slate-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm`}
      />
    </button>
  </div>
);

const VisionBoardModal: React.FC<VisionBoardModalProps> = ({ 
    isOpen, onClose, onSave, currentData, addNotification
}) => {
  const [data, setData] = useState<VisionBoardData>({
      enabled: false,
      title: '',
      targetAmount: 1000,
      imageData: null
  });
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        setData(currentData || {
            enabled: false,
            title: '',
            targetAmount: 1000,
            imageData: null
        });
    }
  }, [currentData, isOpen]);

  const handleChange = (field: keyof VisionBoardData, value: any) => {
      setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            addNotification("L'immagine è troppo grande. Usa un'immagine sotto i 2MB.", 'info');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            handleChange('imageData', reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleChange('imageData', null);
      if (imageInputRef.current) imageInputRef.current.value = '';
  }

  const handleSave = () => {
      onSave(data);
      onClose();
      addNotification('Vision Board aggiornata!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20 dark:border-slate-700 flex flex-col animate-scale-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-white dark:from-slate-800 dark:to-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                    <span className="text-xl">🎯</span>
                 </div>
                 <h2 className="text-xl font-black text-slate-800 dark:text-white">
                    Configura Vision Board
                 </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            <ToggleSwitch 
                label="Abilita Vision Board" 
                description="Mostra il widget del tuo obiettivo nella schermata principale"
                enabled={data.enabled}
                onChange={(val) => handleChange('enabled', val)}
            />

            <div className={`space-y-4 transition-all duration-300 ${!data.enabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Titolo Obiettivo</label>
                    <input 
                    type="text" 
                    placeholder="Es: Rolex Submariner, Viaggio a Dubai..." 
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>
                
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Costo Obiettivo (€)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                        <input 
                            type="number" 
                            placeholder="0" 
                            className="w-full pl-8 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-800 dark:text-white font-mono focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            value={data.targetAmount || ''}
                            onChange={(e) => handleChange('targetAmount', parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1 ml-1">Immagine Obiettivo</label>
                    <div className="relative group">
                    <div 
                        className="relative aspect-video w-full rounded-xl overflow-hidden cursor-pointer shadow-md border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 hover:border-purple-400 transition-colors"
                        onClick={() => imageInputRef.current?.click()}
                    >
                        {data.imageData ? (
                            <>
                                <img src={data.imageData} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <p className="text-white font-bold flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg border border-white/20">
                                        <UploadIcon /> Cambia Foto
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-2">
                                    <UploadIcon />
                                </div>
                                <p className="mt-2 text-sm font-bold">Clicca per caricare</p>
                                <p className="text-xs mt-1 text-slate-400">JPG, PNG (Max 2MB)</p>
                            </div>
                        )}
                    </div>
                    {data.imageData && (
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-lg hover:shadow-rose-500/40 hover:scale-105 active:scale-95 transition-all z-20"
                            title="Rimuovi immagine"
                        >
                            <TrashIcon />
                        </button>
                    )}
                    </div>
                    <input 
                    type="file" 
                    ref={imageInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    />
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors">Annulla</button>
          <button onClick={handleSave} className="px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/30 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all">
              Salva Vision Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisionBoardModal;

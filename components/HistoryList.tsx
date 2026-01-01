import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Trash2, FileText, File } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-ps-panel border-l border-ps-border shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
      <div className="p-4 border-b border-ps-border flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-ps-accent flex items-center gap-2">
          <Clock size={14} /> Local History
        </h3>
        <button onClick={onClose} className="text-ps-muted hover:text-ps-text transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-10 text-ps-muted text-xs font-mono">
            No history stored.
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="group p-3 rounded border border-transparent hover:border-ps-border hover:bg-ps-bg cursor-pointer transition-all relative"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-ps-muted group-hover:text-ps-accent transition-colors">
                  {item.params.type === 'RESEARCH_GUIDE' ? <FileText size={14} /> : <File size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold truncate pr-6 text-ps-text">
                    {item.params.title || 'Untitled Project'}
                  </h4>
                  <p className="text-[10px] text-ps-muted mt-1 truncate">
                    {item.params.hook || (new Date(item.timestamp).toLocaleString())}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => onDelete(item.id, e)}
                className="absolute top-3 right-3 text-ps-muted opacity-0 group-hover:opacity-100 hover:text-ps-error transition-all"
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-ps-border text-[10px] text-ps-muted font-mono text-center">
        Stored locally on your device.
      </div>
    </div>
  );
};

export default HistoryList;
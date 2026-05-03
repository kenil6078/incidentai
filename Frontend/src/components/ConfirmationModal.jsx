import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Delete", 
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger': return <Trash2 className="w-6 h-6 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'danger': return 'bg-[#FF6B6B] hover:bg-[#FF5252] text-white';
      case 'warning': return 'bg-[#FFD93D] hover:bg-[#FFC107] text-black';
      default: return 'bg-[#4D96FF] hover:bg-[#3B82F6] text-white';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-4 border-black p-0 overflow-hidden neo-shadow-lg max-w-[400px]">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border-2 border-black bg-zinc-50 neo-shadow-sm">
              {getIcon()}
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight italic">
                {title}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="py-2">
            <p className="text-sm font-bold text-zinc-600 leading-relaxed border-l-4 border-black pl-4">
              {message}
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-black font-black uppercase text-xs tracking-widest hover:bg-zinc-100 transition-colors active:translate-y-0.5"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-3 border-2 border-black font-black uppercase text-xs tracking-widest transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none ${getConfirmColor()}`}
            >
              {confirmText}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;

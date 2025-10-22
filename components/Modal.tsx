
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] flex flex-col border border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-grow overflow-y-auto pr-4">
            {children}
        </div>
        <div className="flex-shrink-0 pt-4 text-right border-t border-neutral-200 mt-4">
             <button
                onClick={onClose}
                className="px-4 py-2 bg-white text-black rounded-md hover:bg-neutral-100 border border-neutral-300"
                >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
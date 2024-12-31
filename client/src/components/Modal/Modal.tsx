import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useState } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  isOpen?: boolean;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  onOpenComplete?: () => void;
  onCloseComplete?: () => void;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

export const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  children,
  size = 'md',
  isOpen = true,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEsc = true,
  onOpenComplete,
  onCloseComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setIsAnimating(false);
        onOpenComplete?.();
      }, 300);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
      onCloseComplete?.();
    };
  }, [isOpen, closeOnEsc, onClose, onOpenComplete, onCloseComplete]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === modalRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-gray-900/50 backdrop-blur-sm
        transition-opacity duration-300
        ${isAnimating ? 'opacity-0' : 'opacity-100'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        className={`
          relative w-full ${sizeClasses[size]}
          bg-white dark:bg-gray-800
          rounded-2xl shadow-xl
          p-6 md:p-8
          transform transition-all duration-300
          ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
          mx-4 my-8 max-h-[90vh] overflow-y-auto
        `}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 py-2 mb-4">
          <div className="flex justify-between items-center">
            <h2 
              id="modal-title"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </button>
            )}
          </div>
        </div>
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
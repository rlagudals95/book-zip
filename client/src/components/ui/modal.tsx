'use client';

import { Fragment, useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  forceBottomSheet?: boolean; // 강제로 바텀 시트 모드 사용
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  closeOnOutsideClick = true,
  forceBottomSheet = false,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isBottomSheet = forceBottomSheet || isMobile;
  
  // 드래그 관련 상태 (바텀 시트용)
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragCurrentY, setDragCurrentY] = useState<number>(0);
  const dragThreshold = 100; // 이만큼 위로 드래그하면 닫힘

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  // 바텀 시트 드래그 핸들러
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isBottomSheet) return;
    
    const clientY = 'touches' in e 
      ? e.touches[0].clientY 
      : e.clientY;
    
    setDragStartY(clientY);
    setDragCurrentY(0);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartY === null || !isBottomSheet) return;
    
    const clientY = 'touches' in e 
      ? e.touches[0].clientY 
      : e.clientY;
    
    const deltaY = clientY - dragStartY;
    
    // 아래로만 드래그 가능 (위로는 불가)
    if (deltaY > 0) {
      setDragCurrentY(deltaY);
    }
  };

  const handleDragEnd = () => {
    if (!isBottomSheet) return;
    
    if (dragCurrentY > dragThreshold) {
      onClose();
    }
    
    setDragStartY(null);
    setDragCurrentY(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
          
          <motion.div
            ref={contentRef}
            className={cn(
              "fixed z-50 grid w-full max-w-lg bg-background shadow-lg duration-200",
              isBottomSheet 
                ? "bottom-0 left-0 right-0 max-w-none rounded-t-lg border-t p-6" 
                : "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 sm:rounded-lg md:w-full"
            )}
            style={{ 
              transform: isBottomSheet 
                ? `translateY(${dragCurrentY}px)` 
                : 'translate(-50%, -50%)'
            }}
            initial={isBottomSheet 
              ? { y: '100%' } 
              : { opacity: 0, scale: 0.95 }
            }
            animate={isBottomSheet 
              ? { y: 0 } 
              : { opacity: 1, scale: 1 }
            }
            exit={isBottomSheet 
              ? { y: '100%' } 
              : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.2 }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {isBottomSheet && (
              <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-5" 
                   aria-hidden="true" />
            )}
            
            <div className={cn("relative", className)}>
              {showCloseButton && (
                <button 
                  onClick={onClose} 
                  className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">닫기</span>
                </button>
              )}
              
              {title && (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold leading-none tracking-tight">{title}</h2>
                  {description && (
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                  )}
                </div>
              )}
              {children}
            </div>
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};
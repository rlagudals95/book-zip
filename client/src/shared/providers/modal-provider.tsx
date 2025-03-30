'use client';

import { createContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Modal, ModalProps } from '@/components/ui/modal';

type ModalContextProps = {
  openModal: (content: ReactNode, options?: Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>) => void;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextProps>({
  openModal: () => {},
  closeModal: () => {},
});

export interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalOptions, setModalOptions] = useState<Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>>({});
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback((content: ReactNode, options = {}) => {
    setModalContent(content);
    setModalOptions(options);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // 애니메이션이 끝난 후 내용 지우기
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  }, []);

  const modalComponent = typeof window !== 'undefined' ? createPortal(
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      {...modalOptions}
    >
      {modalContent}
    </Modal>,
    document.body
  ) : null;

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalComponent}
    </ModalContext.Provider>
  );
};
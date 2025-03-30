'use client';
import { ModalProvider } from "@/shared/providers/modal-provider";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ModalProvider>
      {children}
    </ModalProvider>
  );
}; 
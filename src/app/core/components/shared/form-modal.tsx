"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  children: ReactNode;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  gradient,
  children,
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-auto animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
        {/* Header - fixed height, no scroll */}
        <div className={`relative ${gradient} p-6 shrink-0`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-sm text-white/80">{subtitle}</p>
              </div>
            </div>
            <button
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content - scrollable vertically only */}
        <div className="p-6 space-y-6 grow overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

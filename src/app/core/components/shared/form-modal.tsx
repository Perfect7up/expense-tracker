"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "../ui/button";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "full";
  hideCloseButton?: boolean;
  preventCloseOnBackdrop?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function FormModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  gradient,
  children,
  size = "md",
  hideCloseButton = false,
  preventCloseOnBackdrop = false,
  showBackButton = false,
  onBack,
}: FormModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "max-w-sm sm:max-w-md md:max-w-lg";
      case "md":
        return "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl";
      case "lg":
        return "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl";
      case "full":
        return "max-w-full h-full sm:h-auto sm:max-w-full sm:m-4";
      default:
        return "max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl";
    }
  };

  const getHeightClasses = () => {
    if (size === "full") {
      return "h-full sm:h-[90vh] sm:rounded-2xl";
    }
    return "max-h-[85vh] sm:max-h-[90vh]";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      {/* Backdrop - different opacity for mobile/desktop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={preventCloseOnBackdrop ? undefined : onClose}
      />

      {/* Modal Container */}
      <div
        className={`relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full mx-auto animate-in zoom-in-95 duration-300 flex flex-col ${
          getHeightClasses()
        } ${getSizeClasses()} ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Header - responsive height and padding */}
        <div
          className={`relative ${gradient} p-4 sm:p-5 md:p-6 shrink-0 ${
            size === "full" ? "rounded-t-xl sm:rounded-t-2xl" : ""
          }`}
        >
          {/* Background effects - responsive sizes */}
          <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-16 sm:translate-x-16 blur-xl sm:blur-2xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6 sm:translate-y-12 sm:-translate-x-12 blur-xl sm:blur-2xl" />

          <div className="relative z-10 flex items-start sm:items-center justify-between gap-3">
            {/* Title and Icon Section */}
            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
              {/* Icon - responsive size */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white">
                  {icon}
                </div>
              </div>
              
              {/* Text Content - responsive typography */}
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Back Button (optional) */}
              {showBackButton && onBack && (
                <Button
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group"
                  onClick={onBack}
                  aria-label="Go back"
                >
                  <svg 
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </Button>
              )}

              {/* Close Button */}
              {!hideCloseButton && (
                <Button
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - scrollable with responsive padding */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6 flex-1 overflow-y-auto overflow-x-hidden">
            {/* Scroll shadow indicators */}
            <div className="sticky top-0 h-2 bg-linear-to-b from-white to-transparent -mt-2 z-10 pointer-events-none" />
            
            {/* Content */}
            {children}
            
            {/* Bottom scroll indicator */}
            <div className="sticky bottom-0 h-2 bg-linear-to-t from-white to-transparent -mb-2 z-10 pointer-events-none" />
          </div>

          {/* Optional: Action buttons at bottom for mobile */}
          {(size === "full" || size === "lg") && (
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:p-6 shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                {showBackButton && onBack && (
                  <Button
                    className="px-4 py-3 sm:py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200"
                    onClick={onBack}
                  >
                    Back
                  </Button>
                )}
                <Button
                  className="px-4 py-3 sm:py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex-1"
                  onClick={onClose}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile swipe indicator (only for full-screen on mobile) */}
        {size === "full" && (
          <div className="hidden sm:block absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-slate-300/50 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}

export function SimpleFormModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto max-h-[85vh] sm:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`relative ${gradient} p-4 sm:p-6 shrink-0 rounded-t-xl sm:rounded-t-2xl`}>
          <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                <div className="w-5 h-5 sm:w-6 sm:h-6 text-white">
                  {icon}
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                  {subtitle}
                </p>
              </div>
            </div>
            <Button
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group shrink-0"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Mobile close hint */}
        <div className="sm:hidden p-4 border-t border-slate-200">
          <div className="text-center text-xs text-slate-500">
            Swipe down or tap outside to close
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdaptiveFormModal({
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
    <>
      <div className="hidden sm:fixed sm:inset-0 sm:z-50 sm:flex sm:items-center sm:justify-center sm:p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
          <div className={`relative ${gradient} p-6 shrink-0 rounded-t-2xl`}>
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
              <Button
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center border border-white/30 transition-all duration-300 group"
                onClick={onClose}
              >
                <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Modal (Fullscreen) */}
      <div className="sm:hidden fixed inset-0 z-50 flex flex-col bg-white">
        <div className={`relative ${gradient} p-4 shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <div className="w-5 h-5 text-white">{icon}</div>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{title}</h2>
                <p className="text-xs text-white/80 truncate">{subtitle}</p>
              </div>
            </div>
            <Button
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
        {/* Mobile bottom bar */}
        <div className="border-t border-slate-200 p-4">
          <Button
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </>
  );
}
import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-6 md:p-8 lg:p-12">
        <div className="backdrop-blur-sm bg-white/70 rounded-3xl border border-slate-200/50 shadow-xl p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
  tagline: string;
  children?: ReactNode;
}
export function PageHeader({
  title,
  description,
  icon,
  tagline,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-6 mb-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium">
          {icon}
          <span>{tagline}</span>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight block bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-lg text-slate-600 mt-4 max-w-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  iconColor: string;
}

export default function InfoCard({
  icon: Icon,
  title,
  description,
  gradient,
  iconColor,
}: InfoCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br ${gradient} flex items-center justify-center shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="font-medium text-slate-900 text-sm sm:text-base">{title}</p>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
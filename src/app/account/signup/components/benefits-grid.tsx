import { TrendingUp, Target, Zap, Users } from "lucide-react";

export default function BenefitsGrid() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Save 30% More",
      description: "Average user savings",
      gradient: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      icon: Target,
      title: "AI Goals",
      description: "Personalized targets",
      gradient: "from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Real-time",
      description: "Live expense tracking",
      gradient: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Users,
      title: "Community",
      description: "50K+ members",
      gradient: "from-orange-100 to-amber-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200/50 shadow-sm"
        >
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br ${benefit.gradient} flex items-center justify-center mb-2 sm:mb-3`}>
            <benefit.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${benefit.iconColor}`} />
          </div>
          <p className="font-semibold text-slate-900 text-sm sm:text-base">{benefit.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
}
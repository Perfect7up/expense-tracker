import { Zap, Shield, Sparkles } from "lucide-react";

export default function FeaturesList() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get personalized financial recommendations",
      linear: "from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and protected",
      linear: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      icon: Sparkles,
      title: "Real-time Analytics",
      description: "Track your finances with live updates",
      linear: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-3 sm:gap-4">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br ${feature.linear} flex items-center justify-center shrink-0`}>
            <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.iconColor}`} />
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm sm:text-base">{feature.title}</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
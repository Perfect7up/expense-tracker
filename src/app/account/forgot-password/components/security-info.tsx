import { Shield, Mail } from "lucide-react";
import InfoCard from "./info-card";

export default function SecurityInfo() {
  const infoItems = [
    {
      icon: Shield,
      title: "Secure & Encrypted",
      description: "Your information is protected with bank-level security",
      gradient: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      icon: Mail,
      title: "Instant Delivery",
      description: "Reset links are sent immediately to your inbox",
      gradient: "from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {infoItems.map((item, index) => (
        <InfoCard key={index} {...item} />
      ))}
    </div>
  );
}
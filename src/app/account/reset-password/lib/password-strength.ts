import { PasswordStrength } from "../types";

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) return { score: 0, color: "bg-slate-200", text: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-emerald-500",
  ];
  const texts = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  
  return { 
    score, 
    color: colors[score] || colors[0], 
    text: texts[score] || texts[0] 
  };
};
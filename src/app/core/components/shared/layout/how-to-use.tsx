import { Sparkles } from "lucide-react";

interface HowToUseProps {
  instructions: string[];
}

export function HowToUse({ instructions }: HowToUseProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-300 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">How to use:</h3>
      </div>
      <ul className="space-y-3 text-sm text-slate-600">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

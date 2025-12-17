export default function Testimonial() {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-sm">
        <p className="text-slate-600 italic text-sm sm:text-base mb-3 sm:mb-4">
          "FinanciAI helped me save over $500 in my first month. The AI insights are game-changing!"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-300" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Sarah Chen</p>
            <p className="text-xs text-slate-500">Premium User</p>
          </div>
        </div>
      </div>
    );
  }
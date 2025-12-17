export default function TestimonialCard() {
    return (
      <div className="bg-linear-to-r from-blue-500/5 to-cyan-500/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/30">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-blue-400 to-cyan-300" />
          <div>
            <p className="font-semibold text-slate-900 text-sm sm:text-base">Alex Johnson</p>
            <p className="text-xs sm:text-sm text-slate-500">Saved $2,400 in 3 months</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm sm:text-base">
          "The AI insights helped me identify wasteful subscriptions I didn't even remember having!"
        </p>
      </div>
    );
  }
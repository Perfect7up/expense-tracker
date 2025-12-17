import Link from "next/link";

export default function HelpCard() {
  return (
    <div className="bg-linear-to-r from-blue-500/5 to-cyan-500/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200/30">
      <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-2">Need help?</h3>
      <p className="text-slate-600 text-xs sm:text-sm">
        If you don't receive an email within a few minutes, check your
        spam folder or contact our{" "}
        <Link
          href="/support"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          support team
        </Link>
        .
      </p>
    </div>
  );
}
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Wifi, Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-lg shadow-sm py-3" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Wifi
                    className="h-5 w-5 text-white rotate-45"
                    strokeWidth={3}
                  />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                FINANCI
                <span className="bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <Link href="/auth/signin">
                  <Button
                    variant="ghost"
                    className="rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex items-center">
                  <Button className="rounded-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-300">
                    Get Started Free
                    <Sparkles className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <Button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </Button>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 md:hidden animate-in slide-in-from-top duration-300">
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg">
            <div className="container mx-auto px-6 py-8">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-100/50 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-slate-200">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full py-3.5 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-blue-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex items-center">
                  <Button
                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                    <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="h-20 md:h-24" />
    </>
  );
}

"use client";
import Navbar from "./core/components/home/navbar";
import Hero from "./core/components/home/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  );
}

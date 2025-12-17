"use client";

import { useState } from "react";
import { useSupportTicket } from "./hook/use-support";
import { Button } from "@/app/core/components/ui/button";
import { Input } from "@/app/core/components/ui/input"; // Assuming you have this
import { Textarea } from "@/app/core/components/ui/textarea"; // Assuming you have this
import {
  LifeBuoy,
  Send,
  MessageSquare,
  Mail,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { cn } from "@/app/core/lib/utils";

// Import shared components (matching your reference)
import {
  BackgroundEffects,
  PageHeader,
} from "@/app/core/components/shared/layout";

export default function HelpSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const { mutate: submitTicket, isPending } = useSupportTicket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTicket(
      { subject, message },
      {
        onSuccess: () => {
          setSubject("");
          setMessage("");
        },
      }
    );
  };

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5 text-white" />,
      label: "Email Support",
      value: "support@expensetracker.ai",
      color: "from-blue-500 to-cyan-400",
      description: "Response within 24 hours",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      label: "Live Chat",
      value: "Available 9am - 5pm EST",
      color: "from-purple-500 to-pink-400",
      description: "Get instant answers",
    },
  ];

  const faqs = [
    "How do I export my expense reports?",
    "Can I connect multiple bank accounts?",
    "How does the AI categorization work?",
    "Is my financial data encrypted?",
  ];

  return (
    <div className="relative min-h-screen px-4 py-8 overflow-hidden">
      <BackgroundEffects />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/20" />

      <div className="container mx-auto relative z-10">
        <PageHeader
          title="HELP & SUPPORT"
          description="Have a question or run into an issue? We're here to help you get back on track with your finances."
          icon={<LifeBuoy className="w-4 h-4" />}
          tagline="24/7 Assistance"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-200/50 shadow-lg relative overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-500" />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Send className="w-6 h-6 text-white ml-1" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Send us a Message</h2>
                  <p className="text-slate-500 text-sm">Fill out the form below and we'll resolve your issue.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Subject
                    <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Briefly describe your issue..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-12 bg-white/50 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    Message
                    <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell us more about what happened..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-[180px] bg-white/50 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all rounded-xl resize-none p-4"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isPending || !subject || !message}
                    size="lg"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 h-12 px-8"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Send Message
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="group bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50 hover:border-blue-200/50 transition-all duration-300 hover:shadow-md hover:bg-white/80"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center shrink-0 shadow-sm`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {method.label}
                      </p>
                      <p className="text-slate-600 text-sm font-medium mt-0.5">
                        {method.value}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{method.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Answers / FAQ */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 rounded-2xl p-6 border border-indigo-100/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-900">Common Questions</h3>
              </div>
              <ul className="space-y-3">
                {faqs.map((faq, i) => (
                  <li key={i}>
                    <button className="w-full text-left flex items-start gap-2.5 text-sm text-slate-600 hover:text-indigo-600 transition-colors group p-2 hover:bg-indigo-50/50 rounded-lg">
                      <HelpCircle className="w-4 h-4 mt-0.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                      <span className="font-medium">{faq}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status Indicator */}
            <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-medium text-emerald-800">
                Systems are fully operational
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
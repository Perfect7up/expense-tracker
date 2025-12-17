"use client";

import React, { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/app/core/components/ui/input";
import { Button } from "@/app/core/components/ui/button";
import {
  Loader2,
  MessageSquare,
  Send,
  X,
  CheckCircle,
  RefreshCw,
  HelpCircle,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { useChatStore } from "../../store/chat-store";
import { generateMessageId } from "../../utils/utils";
import { ChatMessage } from "./chat-message";
import { CommandMenu } from "./command-menu";
import { KpiData, Message } from "../../types/types";

const AiChatBase: React.FC = () => {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    open,
    setOpen,
    input,
    setInput,
    messages,
    addMessage,
    clearMessages,
    messageCounter,
    incrementCounter,
    loading,
    setLoading,
    success,
    setSuccess,
  } = useChatStore();

  useEffect(() => {
    if (open && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isMinimized, showHelp]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || loading) return;

    if (textOverride) setShowHelp(false);

    const userMessage: Message = {
      id: generateMessageId(messageCounter),
      type: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    incrementCounter();
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/ai-command-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: generateMessageId(messageCounter + 1),
        type: "ai",
        text: data.message || "Response received",
        timestamp: new Date(),
        downloadUrl: data.downloadUrl,
      };

      addMessage(aiMessage);
      incrementCounter();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      if(!data.downloadUrl) {
        handleRefreshData();
      }
      
    } catch (err) {
      addMessage({
        id: generateMessageId(messageCounter + 1),
        type: "ai",
        text: `Error: ${err instanceof Error ? err.message : "Network error"}`,
        timestamp: new Date(),
      });
      incrementCounter();
    } finally {
      setLoading(false);
    }
  }, [
    input,
    loading,
    messageCounter,
    addMessage,
    incrementCounter,
    setLoading,
    setInput,
    setSuccess,
  ]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleRefreshData = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["kpi"] });
    await queryClient.invalidateQueries({ queryKey: ["reports"] });
  }, [queryClient]);

  const currentKpi = queryClient.getQueryData<KpiData>(["kpi"]);
  const balance = useMemo(() => currentKpi?.balance || 0, [currentKpi]);

  const handleCommandSelect = (cmd: string) => {
    setInput(cmd);
    // Uncomment to auto-send
    // handleSend(cmd);
  };

  if (!open) {
    return (
      <div className={`fixed z-50 ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'}`}>
        <button
          onClick={() => setOpen(true)}
          className={`bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform ${
            success ? "ring-4 ring-green-500" : ""
          }`}
        >
          {success ? (
            <CheckCircle className="w-6 h-6" />
          ) : loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className={`fixed z-50 ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'}`}>
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl overflow-hidden">
          <div className="flex items-center">
            <button
              onClick={() => setIsMinimized(false)}
              className="px-4 py-3 hover:bg-white/10 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-3 hover:bg-white/10 transition-colors border-l border-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 ${isMobile ? 'inset-0 md:bottom-6 md:right-6 md:inset-auto' : 'bottom-6 right-6'}`}>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsMinimized(true)}
        />
      )}

      {/* Chat Window */}
      <div className={`${
        isMobile 
          ? 'fixed inset-4 md:relative md:w-96 md:h-[600px]' 
          : 'w-96 h-[600px]'
      } bg-white dark:bg-gray-900 shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 md:max-h-[calc(100vh-3rem)]`}>
        
        {/* HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {success ? (
                <CheckCircle className="w-5 h-5" />
              ) : loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MessageSquare className="w-5 h-5" />
              )}
            </div>
            <div>
              <span className="font-bold">Finance Assistant</span>
              <div className="text-xs text-blue-100 flex items-center gap-1">
                {loading ? "Processing..." : "Real-time updates"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Minimize Button */}
            {isMobile && (
              <button
                onClick={() => setIsMinimized(true)}
                title="Minimize"
                className="p-1.5 hover:bg-white/20 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}

            {/* Sync Button */}
            <button
              onClick={handleRefreshData}
              disabled={loading}
              title="Sync Data"
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            {/* Clear Button */}
            <button
              onClick={clearMessages}
              title="Clear Chat"
              className="p-1.5 hover:bg-white/20 rounded transition-colors"
            >
              <span className="text-xs font-bold">CLR</span>
            </button>

            {/* Help Button */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              title="Help / Commands"
              className={`p-1.5 hover:bg-white/20 rounded transition-colors ${showHelp ? "bg-white/30" : ""}`}
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950">
          {(showHelp || messages.length === 0) ? (
            <div className="h-full flex flex-col">
              {messages.length > 0 && (
                <button 
                  onClick={() => setShowHelp(false)} 
                  className="mb-4 text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to chat
                </button>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Quick Commands
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select a command or type your own question
                </p>
              </div>
              <CommandMenu onSelect={handleCommandSelect} />
            </div>
          ) : (
            <>
              {messages.map((m) => (
                <ChatMessage key={m.id} m={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm pl-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={showHelp ? "Select a command or type..." : "Type 'help' for commands..."}
                className="pr-10"
                disabled={loading}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`bg-linear-to-r from-blue-600 to-purple-600 ${
                success ? "bg-green-600" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-between">
            <span>
              Balance:{" "}
              <span
                className={`font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                ${balance.toFixed(2)}
              </span>
            </span>
            <span className="text-blue-600">AI Powered</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AiChat = React.memo(AiChatBase);
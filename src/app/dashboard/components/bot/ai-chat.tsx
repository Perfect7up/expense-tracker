"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { useChatStore } from "../../store/chat-store";
import { generateMessageId } from "../../utils/utils";
import { ChatMessage } from "./chat-message";
import { KpiData, Message } from "../../types/types";

const AiChatBase: React.FC = () => {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: generateMessageId(messageCounter),
      type: "user",
      text: input,
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
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      const aiMessage: Message = {
        id: generateMessageId(messageCounter + 1),
        type: "ai",
        text: data.message || "Response received",
        timestamp: new Date(),
        downloadUrl: data.fileUrl,
      };

      addMessage(aiMessage);
      incrementCounter();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
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
    await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    await queryClient.invalidateQueries({ queryKey: ["incomes"] });

    addMessage({
      id: generateMessageId(messageCounter),
      type: "ai",
      text: "Dashboard data refreshed successfully!",
      timestamp: new Date(),
    });
    incrementCounter();
  }, [queryClient, messageCounter, addMessage, incrementCounter]);

  const currentKpi = queryClient.getQueryData<KpiData>(["kpi"]);
  const balance = useMemo(() => currentKpi?.balance || 0, [currentKpi]);

  if (!open) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="w-96 h-[600px] bg-white dark:bg-gray-900 shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshData}
              disabled={loading}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded flex items-center gap-1 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
              Sync
            </button>
            <button
              onClick={clearMessages}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-950">
          {messages.map((m) => (
            <ChatMessage key={m.id} m={m} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Chat..."
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
              onClick={handleSend}
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
            <span className="text-blue-600">Updates instantly ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AiChat = React.memo(AiChatBase);

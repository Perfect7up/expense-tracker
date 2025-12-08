"use client";

import React from "react";
import { Button } from "@/app/core/components/ui/button";
import { Download } from "lucide-react";
import { Message } from "../../types/types";
import { formatTime, triggerDownload } from "../../utils/utils";

interface ChatMessageProps {
  m: Message;
}

const ChatMessageBase: React.FC<ChatMessageProps> = ({ m }) => {
  return (
    <div
      className={`flex flex-col ${m.type === "user" ? "items-end" : "items-start"}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`text-xs ${
            m.type === "user" ? "text-gray-500" : "text-blue-500"
          } font-medium`}
        >
          {m.type === "user" ? "You" : "Assistant"}
        </div>
        <div className="text-xs text-gray-400">{formatTime(m.timestamp)}</div>
      </div>
      <div
        className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap wrap-break-word ${
          m.type === "user"
            ? "bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm"
        }`}
      >
        {m.text}
        {m.downloadUrl && (
          <Button
            onClick={() => {
              if (!m.downloadUrl) return;
              const urlParts = m.downloadUrl.split("type=");
              const type = urlParts[1]?.split("&")[0] || "summary";
              const timestamp = new Date().toISOString().split("T")[0];
              const filename = `${type}-summary-${timestamp}.csv`;
              triggerDownload(m.downloadUrl, filename);
            }}
            variant="secondary"
            className="mt-3 w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download File
          </Button>
        )}
      </div>
    </div>
  );
};

export const ChatMessage = React.memo(ChatMessageBase);

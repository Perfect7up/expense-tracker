import React from "react";
import { HELP_CATEGORIES } from "../../constants/chat-commands";

interface CommandMenuProps {
  onSelect: (text: string) => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onSelect }) => {
  return (
    <div className="space-y-4 p-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        What would you like to do?
      </div>
      
      {HELP_CATEGORIES.map((category) => (
        <div key={category.id} className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
            <category.icon className={`w-3 h-3 ${category.color}`} />
            {category.label}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {category.examples.map((example, i) => (
              <button
                key={i}
                onClick={() => onSelect(example)}
                className="text-left text-sm p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-xs"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
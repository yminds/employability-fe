// /src/components/ChatInput.tsx

import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isDisabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isDisabled }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isDisabled ? "Initializing chat..." : "Ask your mentor..."}
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm bg-gray-50"
          disabled={isDisabled}
        />
        <button
          onClick={onSend}
          disabled={isDisabled || !value.trim()}
          className={`p-3 rounded-full shadow-md transition-all ${
            isDisabled || !value.trim()
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;

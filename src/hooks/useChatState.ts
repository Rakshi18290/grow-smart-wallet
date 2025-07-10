import { useState } from "react";

export interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your BudgetBot AI assistant. I can help you with financial advice, budget analysis, and goal planning. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      id: Date.now(),
      timestamp: new Date(),
      ...message
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const clearInput = () => setInput("");

  return {
    messages,
    input,
    setInput,
    isLoading,
    setIsLoading,
    addMessage,
    clearInput
  };
}
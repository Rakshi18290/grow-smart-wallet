import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot } from "lucide-react";
import { useState } from "react";
import { useAIResponses } from "@/hooks/useAIResponses";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  financialData: {
    totalIncome: number;
    totalExpenses: number;
    budgetCategories: any[];
    goals: any[];
  };
}

export function AIAssistant({ financialData }: AIAssistantProps) {
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

  const { generateAIResponse } = useAIResponses(financialData);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth h-[500px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Bot className="h-5 w-5 text-primary" />
          AI Financial Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-0">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <Separator />
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
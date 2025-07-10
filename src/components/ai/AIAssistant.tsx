import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot } from "lucide-react";
import { useChatState } from "@/hooks/useChatState";
import { useMessageHandler } from "@/hooks/useMessageHandler";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import type { FinancialData } from "@/types/financial";

interface AIAssistantProps {
  financialData: FinancialData;
}

export function AIAssistant({ financialData }: AIAssistantProps) {
  const {
    messages,
    input,
    setInput,
    isLoading,
    addMessage,
    clearInput,
    setIsLoading
  } = useChatState();

  const { sendMessage } = useMessageHandler({
    financialData,
    addMessage,
    clearInput,
    setIsLoading
  });

  const handleSendMessage = () => {
    sendMessage(input);
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
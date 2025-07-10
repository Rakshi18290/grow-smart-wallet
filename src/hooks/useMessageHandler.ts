import { useAIResponses } from "./useAIResponses";
import type { Message } from "./useChatState";
import type { FinancialData } from "@/types/financial";

interface UseMessageHandlerProps {
  financialData: FinancialData;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  clearInput: () => void;
  setIsLoading: (loading: boolean) => void;
}

export function useMessageHandler({
  financialData,
  addMessage,
  clearInput,
  setIsLoading
}: UseMessageHandlerProps) {
  const { generateAIResponse } = useAIResponses(financialData);

  const sendMessage = (input: string) => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      type: 'user',
      content: input
    });

    clearInput();
    setIsLoading(true);

    // Simulate AI processing time and add AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      addMessage({
        type: 'ai',
        content: aiResponse
      });
      setIsLoading(false);
    }, 1000);
  };

  return { sendMessage };
}
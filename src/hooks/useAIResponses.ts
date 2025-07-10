import { useAIResponseHandlers } from "./useAIResponseHandlers";
import type { FinancialData } from "@/types/financial";

interface QueryMatcher {
  keywords: string[];
  handler: () => string;
}

export function useAIResponses(financialData: FinancialData) {
  const handlers = useAIResponseHandlers(financialData);

  const queryMatchers: QueryMatcher[] = [
    {
      keywords: ['analysis', 'overview', 'summary'],
      handler: handlers.handleAnalysisQuery
    },
    {
      keywords: ['budget', 'spending'],
      handler: handlers.handleBudgetQuery
    },
    {
      keywords: ['goal', 'target'],
      handler: handlers.handleGoalsQuery
    },
    {
      keywords: ['invest', 'investment', 'sip'],
      handler: handlers.handleInvestmentQuery
    },
    {
      keywords: ['save', 'saving'],
      handler: handlers.handleSavingsQuery
    },
    {
      keywords: ['debt', 'loan', 'emi'],
      handler: handlers.handleDebtQuery
    }
  ];

  const generateAIResponse = (userInput: string): string => {
    const inputLower = userInput.toLowerCase();

    // Find the first matching query type
    const matcher = queryMatchers.find(({ keywords }) =>
      keywords.some(keyword => inputLower.includes(keyword))
    );

    return matcher ? matcher.handler() : handlers.handleDefaultQuery();
  };

  return { generateAIResponse };
}
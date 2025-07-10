import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

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

  const getFinancialInsights = () => {
    const { totalIncome, totalExpenses, budgetCategories, goals } = financialData;
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    
    return {
      savingsRate: Math.round(savingsRate),
      remainingBudget: totalIncome - totalExpenses,
      totalGoals: goals.length,
      totalGoalAmount,
      spendingByCategory: budgetCategories.map(cat => ({
        name: cat.name,
        spent: cat.spent,
        percentage: Math.round((cat.spent / totalExpenses) * 100)
      }))
    };
  };

  const generateAIResponse = (userInput: string) => {
    const insights = getFinancialInsights();
    const input_lower = userInput.toLowerCase();

    // Simple rule-based responses (in a real app, you'd use OpenAI API)
    if (input_lower.includes('budget') || input_lower.includes('spending')) {
      if (insights.savingsRate > 20) {
        return `Great job! You're saving ${insights.savingsRate}% of your income. Your spending looks healthy. Consider increasing your emergency fund or investing the surplus.`;
      } else if (insights.savingsRate > 0) {
        return `You're saving ${insights.savingsRate}% of your income, which is a good start. Try to aim for 20% savings rate by reducing discretionary spending.`;
      } else {
        return `You're currently spending more than you earn. I recommend reviewing your expenses and cutting back on non-essential items to get back on track.`;
      }
    }

    if (input_lower.includes('save') || input_lower.includes('saving')) {
      return `Based on your current income of ₹${financialData.totalIncome.toLocaleString()}, I recommend saving at least ₹${Math.round(financialData.totalIncome * 0.2).toLocaleString()} per month (20% rule). You currently have ₹${insights.remainingBudget.toLocaleString()} remaining this month.`;
    }

    if (input_lower.includes('goal') || input_lower.includes('target')) {
      if (insights.totalGoals > 0) {
        return `You have ${insights.totalGoals} financial goals totaling ₹${insights.totalGoalAmount.toLocaleString()}. To achieve these goals, consider setting up automatic transfers and track your progress monthly.`;
      } else {
        return `Setting financial goals is crucial for success! Start with an emergency fund of 6 months' expenses, then add goals for major purchases or investments.`;
      }
    }

    if (input_lower.includes('invest') || input_lower.includes('investment')) {
      return `With your current savings rate of ${insights.savingsRate}%, consider starting with SIPs in index funds or balanced mutual funds. Start small with ₹5,000-10,000 per month and increase gradually.`;
    }

    if (input_lower.includes('debt') || input_lower.includes('loan')) {
      return `Focus on paying off high-interest debt first (credit cards, personal loans). Consider the debt avalanche method - pay minimums on all debts, then put extra money toward the highest interest rate debt.`;
    }

    // Default response
    return `I can help you with budgeting, saving strategies, investment advice, debt management, and goal planning. Based on your data, you're currently saving ${insights.savingsRate}% of your income. What specific area would you like to improve?`;
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        <ScrollArea className="flex-1 px-6 pb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex gap-3 max-w-[80%] ${
                  message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="h-4 w-4 animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me about your finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
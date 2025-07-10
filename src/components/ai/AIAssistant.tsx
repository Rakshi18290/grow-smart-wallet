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

  const generateComprehensivePrompt = (userInput: string, insights: any) => {
    return `You are a professional financial advisor AI assistant. Analyze the user's complete financial profile and provide personalized advice.

FINANCIAL PROFILE:
• Monthly Income: ₹${financialData.totalIncome.toLocaleString()}
• Monthly Expenses: ₹${financialData.totalExpenses.toLocaleString()}
• Savings Rate: ${insights.savingsRate}%
• Remaining Budget: ₹${insights.remainingBudget.toLocaleString()}
• Active Goals: ${insights.totalGoals} (Total: ₹${insights.totalGoalAmount.toLocaleString()})

SPENDING BREAKDOWN:
${insights.spendingByCategory.map(cat => `• ${cat.name}: ₹${cat.spent.toLocaleString()} (${cat.percentage}%)`).join('\n')}

CURRENT GOALS:
${financialData.goals.map(goal => {
  const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  return `• ${goal.name}: ₹${goal.currentAmount.toLocaleString()}/₹${goal.targetAmount.toLocaleString()} (${progress}% complete)`;
}).join('\n')}

USER QUESTION: "${userInput}"

Please provide comprehensive, actionable advice considering:
1. Cash flow optimization
2. Budget allocation (50/30/20 rule vs current spending)
3. Goal achievement strategies
4. Investment opportunities
5. Risk management
6. Tax implications (if relevant)
7. Emergency fund status

Keep response under 150 words, practical, and India-specific.`;
  };

  const generateAIResponse = (userInput: string) => {
    const insights = getFinancialInsights();
    const input_lower = userInput.toLowerCase();

    // Comprehensive financial analysis
    if (input_lower.includes('analysis') || input_lower.includes('overview') || input_lower.includes('summary')) {
      const budgetHealth = insights.savingsRate > 20 ? 'Excellent' : insights.savingsRate > 10 ? 'Good' : 'Needs Improvement';
      const topSpender = insights.spendingByCategory.reduce((max, cat) => cat.spent > max.spent ? cat : max, insights.spendingByCategory[0]);
      
      return `📊 **Financial Health: ${budgetHealth}**\n\n💰 You're saving ${insights.savingsRate}% (₹${insights.remainingBudget.toLocaleString()}) of your ₹${financialData.totalIncome.toLocaleString()} income.\n\n📈 Highest expense: ${topSpender.name} (${topSpender.percentage}%)\n\n🎯 Goals Progress: ${financialData.goals.filter(g => g.currentAmount > 0).length}/${insights.totalGoals} goals active\n\n💡 Quick tip: ${insights.savingsRate < 20 ? 'Try to increase savings by 5% monthly' : 'Consider diversifying investments for better returns'}`;
    }

    // Budget-specific analysis
    if (input_lower.includes('budget') || input_lower.includes('spending')) {
      const budgetCategories = financialData.budgetCategories;
      const needsCategory = budgetCategories.find(cat => cat.name.includes('Needs'));
      const wantsCategory = budgetCategories.find(cat => cat.name.includes('Wants'));
      
      return `📊 **Budget Analysis:**\n\n🏠 Needs: ₹${needsCategory.spent.toLocaleString()}/₹${needsCategory.budget.toLocaleString()} (${Math.round((needsCategory.spent/needsCategory.budget)*100)}%)\n🎯 Wants: ₹${wantsCategory.spent.toLocaleString()}/₹${wantsCategory.budget.toLocaleString()} (${Math.round((wantsCategory.spent/wantsCategory.budget)*100)}%)\n\n${insights.savingsRate > 20 ? '✅ Great budgeting! Consider investing surplus.' : insights.savingsRate > 0 ? '⚠️ Good start. Try the 50/30/20 rule.' : '🚨 Overspending detected. Review expenses immediately.'}`;
    }

    // Goal-specific analysis
    if (input_lower.includes('goal') || input_lower.includes('target')) {
      if (insights.totalGoals > 0) {
        const activeGoals = financialData.goals.filter(g => g.currentAmount < g.targetAmount);
        const completedGoals = financialData.goals.filter(g => g.currentAmount >= g.targetAmount);
        
        return `🎯 **Goals Overview:**\n\n✅ Completed: ${completedGoals.length}\n🔄 Active: ${activeGoals.length}\n💰 Total Target: ₹${insights.totalGoalAmount.toLocaleString()}\n\n${activeGoals.length > 0 ? `Next milestone: ${activeGoals[0].name} (${Math.round((activeGoals[0].currentAmount/activeGoals[0].targetAmount)*100)}% done)` : 'All goals achieved! Time to set new ones.'}`;
      } else {
        return `🎯 **Start Your Financial Journey!**\n\nRecommended first goals:\n• Emergency Fund: ₹${Math.round(financialData.totalExpenses * 6).toLocaleString()} (6 months expenses)\n• Health Insurance: ₹50,000\n• Investment Goal: ₹25,000\n\nSet SMART goals with deadlines for better success!`;
      }
    }

    // Investment advice
    if (input_lower.includes('invest') || input_lower.includes('investment') || input_lower.includes('sip')) {
      const monthlyInvestment = Math.round(insights.remainingBudget * 0.7);
      return `💹 **Investment Strategy:**\n\n💰 Available for investment: ₹${monthlyInvestment.toLocaleString()}/month\n\n🔰 Beginner Portfolio:\n• Large Cap Mutual Funds: 40%\n• Mid/Small Cap: 30%\n• Debt Funds: 20%\n• Gold/International: 10%\n\n📈 Start with ₹${Math.min(monthlyInvestment, 10000).toLocaleString()}/month SIP and increase by 10% annually.`;
    }

    // Savings optimization
    if (input_lower.includes('save') || input_lower.includes('saving')) {
      const targetSavings = Math.round(financialData.totalIncome * 0.2);
      const currentSavings = insights.remainingBudget;
      const deficit = targetSavings - currentSavings;
      
      return `💰 **Savings Optimization:**\n\n🎯 Target (20%): ₹${targetSavings.toLocaleString()}\n💵 Current: ₹${currentSavings.toLocaleString()}\n${deficit > 0 ? `📉 Shortfall: ₹${deficit.toLocaleString()}` : `📈 Surplus: ₹${Math.abs(deficit).toLocaleString()}`}\n\n💡 Tips: ${deficit > 0 ? 'Reduce dining out by 25%, cancel unused subscriptions' : 'Great! Consider increasing investment allocation'}`;
    }

    // Debt management
    if (input_lower.includes('debt') || input_lower.includes('loan') || input_lower.includes('emi')) {
      return `💳 **Debt Management Strategy:**\n\n🔴 High Priority: Credit Card debt (18-24% interest)\n🟡 Medium: Personal Loans (12-16%)\n🟢 Low: Home Loans (8-10%)\n\n📋 Action Plan:\n1. List all debts with interest rates\n2. Pay minimums on all\n3. Extra payment to highest interest debt\n4. Consider debt consolidation if multiple high-interest debts`;
    }

    // Default comprehensive response
    return `🤖 **How can I help optimize your finances?**\n\n📊 Current Status: ${insights.savingsRate}% savings rate\n💰 Monthly Surplus: ₹${insights.remainingBudget.toLocaleString()}\n\nI can help with:\n• Budget optimization\n• Investment strategies\n• Goal planning\n• Debt management\n• Tax planning\n\nAsk me anything specific about your ₹${financialData.totalIncome.toLocaleString()} monthly income management!`;
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
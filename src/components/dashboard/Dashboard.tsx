import { useState, useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import { BudgetOverview } from "./BudgetOverview";
import { QuickActions } from "./QuickActions";
import { AIAssistant } from "../ai/AIAssistant";
import { GoalsTracker } from "../goals/GoalsTracker";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet, 
  PiggyBank,
  CreditCard,
  Bot
} from "lucide-react";

export function Dashboard() {
  // Mock data - in a real app, this would come from your backend/state management
  const [financialData, setFinancialData] = useState({
    totalIncome: 85000,
    totalExpenses: 62000,
    totalSavings: 15000,
    totalDebt: 120000,
    transactions: [] as any[],
    goals: [
      {
        id: 1,
        name: "Emergency Fund",
        targetAmount: 250000,
        currentAmount: 65000,
        deadline: "2024-12-31",
        description: "6 months of expenses for financial security"
      },
      {
        id: 2,
        name: "Vacation to Japan",
        targetAmount: 150000,
        currentAmount: 42000,
        deadline: "2024-08-15",
        description: "Dream trip to Tokyo and Kyoto"
      },
      {
        id: 3,
        name: "New Laptop",
        targetAmount: 120000,
        currentAmount: 95000,
        deadline: "2024-05-30",
        description: "MacBook Pro for work and development"
      }
    ] as any[]
  });

  const budgetCategories = [
    {
      name: "Needs (Housing, Food, Transport)",
      spent: 42500,
      budget: 42500, // 50% of income
      color: "bg-primary"
    },
    {
      name: "Wants (Entertainment, Shopping)",
      spent: 19500,
      budget: 25500, // 30% of income
      color: "bg-warning"
    },
    {
      name: "Savings & Investments",
      spent: 0,
      budget: 17000, // 20% of income
      color: "bg-success"
    }
  ];

  const handleAddExpense = (expense: any) => {
    setFinancialData(prev => ({
      ...prev,
      totalExpenses: prev.totalExpenses + expense.amount,
      transactions: [...prev.transactions, expense]
    }));
  };

  const handleAddIncome = (income: any) => {
    setFinancialData(prev => ({
      ...prev,
      totalIncome: prev.totalIncome + income.amount,
      transactions: [...prev.transactions, income]
    }));
  };

  const handleAddGoal = (goal: any) => {
    setFinancialData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));
  };

  const handleUpdateGoal = (goalId: number, amount: number) => {
    setFinancialData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount) }
          : goal
      )
    }));
  };

  const remainingBudget = financialData.totalIncome - financialData.totalExpenses;
  const savingsRate = ((remainingBudget) / financialData.totalIncome) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-hero">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">BudgetBot</h1>
              <p className="text-blue-100 mt-1">Your AI-Powered Financial Assistant</p>
            </div>
            <div className="text-white text-right">
              <div className="text-sm opacity-90">Welcome back!</div>
              <div className="text-lg font-semibold">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Income"
            value={`₹${financialData.totalIncome.toLocaleString()}`}
            subtitle="This month"
            icon={<TrendingUp />}
            variant="success"
            trend={{ value: 8.2, isPositive: true }}
          />
          <DashboardCard
            title="Total Expenses"
            value={`₹${financialData.totalExpenses.toLocaleString()}`}
            subtitle="This month"
            icon={<TrendingDown />}
            variant="destructive"
            trend={{ value: 3.1, isPositive: false }}
          />
          <DashboardCard
            title="Available Balance"
            value={`₹${remainingBudget.toLocaleString()}`}
            subtitle={`${Math.round(savingsRate)}% savings rate`}
            icon={<Wallet />}
            variant={remainingBudget > 0 ? "success" : "destructive"}
          />
          <DashboardCard
            title="Active Goals"
            value={financialData.goals.length}
            subtitle={`₹${financialData.goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()} target`}
            icon={<Target />}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Budget & Actions */}
          <div className="lg:col-span-2 space-y-8">
            <BudgetOverview 
              categories={budgetCategories}
              totalIncome={financialData.totalIncome}
            />
            
            <QuickActions
              onAddExpense={handleAddExpense}
              onAddIncome={handleAddIncome}
              onAddGoal={handleAddGoal}
            />

            <GoalsTracker 
              goals={financialData.goals}
              onUpdateGoal={handleUpdateGoal}
            />
          </div>

          {/* Right Column - AI Assistant */}
          <div className="space-y-8">
            <AIAssistant 
              financialData={{
                totalIncome: financialData.totalIncome,
                totalExpenses: financialData.totalExpenses,
                budgetCategories,
                goals: financialData.goals
              }}
            />

            {/* Quick Tips Card */}
            <div className="bg-gradient-card rounded-lg p-6 border border-border shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Smart Insights</h3>
              </div>
              <div className="space-y-3 text-sm">
                {savingsRate > 20 && (
                  <div className="p-3 bg-success-muted border border-success rounded-lg">
                    <p className="text-success-foreground">
                      🎉 Excellent! You're saving {Math.round(savingsRate)}% of your income. 
                      Consider investing the surplus for long-term growth.
                    </p>
                  </div>
                )}
                
                {savingsRate < 10 && savingsRate > 0 && (
                  <div className="p-3 bg-warning-muted border border-warning rounded-lg">
                    <p className="text-warning-foreground">
                      ⚠️ Your savings rate is {Math.round(savingsRate)}%. Try to reach 20% by reducing discretionary spending.
                    </p>
                  </div>
                )}

                {remainingBudget < 0 && (
                  <div className="p-3 bg-destructive-muted border border-destructive rounded-lg">
                    <p className="text-destructive-foreground">
                      🚨 You're ₹{Math.abs(remainingBudget).toLocaleString()} over budget this month. Review your expenses immediately.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    💡 Tip: Set up automatic transfers to your savings accounts to make saving effortless.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { DashboardCard } from "./DashboardCard";
import { BudgetOverview } from "./BudgetOverview";
import { QuickActions } from "./QuickActions";
import { AIAssistant } from "../ai/AIAssistant";
import { GoalsTracker } from "../goals/GoalsTracker";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserFinancialData } from "@/hooks/useUserFinancialData";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Wallet, 
  Bot,
  LogOut,
  User
} from "lucide-react";

export function Dashboard() {
  const { currentUser, userProfile, signOut } = useAuth();
  const {
    financialData,
    budgetCategories,
    goals,
    loading,
    error,
    addExpense,
    addIncome,
    addGoal,
    updateGoalProgress
  } = useUserFinancialData();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const totalIncome = financialData?.totalIncome || 0;
  const totalExpenses = financialData?.totalExpenses || 0;
  const remainingBudget = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((remainingBudget) / totalIncome) * 100 : 0;

  // Convert database budget categories to the format expected by components
  const formattedBudgetCategories = budgetCategories.map(category => ({
    name: category.name,
    spent: category.spent,
    budget: category.budget,
    color: category.color
  }));

  // Convert database goals to the format expected by components  
  const formattedGoals = goals.map(goal => ({
    id: goal.id,
    name: goal.name,
    targetAmount: goal.targetAmount,
    currentAmount: goal.currentAmount,
    deadline: goal.deadline,
    description: goal.description
  }));

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
            <div className="flex items-center gap-4 text-white">
              <div className="text-right">
                <div className="text-sm opacity-90">Welcome back!</div>
                <div className="text-lg font-semibold">
                  {userProfile?.displayName || currentUser?.email || 'User'}
                </div>
                <div className="text-sm opacity-75">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              {userProfile?.photoURL && (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-white hover:bg-white/20"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Income"
            value={`₹${totalIncome.toLocaleString()}`}
            subtitle="This month"
            icon={<TrendingUp />}
            variant="success"
            trend={{ value: 8.2, isPositive: true }}
          />
          <DashboardCard
            title="Total Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
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
            value={formattedGoals.length}
            subtitle={`₹${formattedGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()} target`}
            icon={<Target />}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Budget & Actions */}
          <div className="lg:col-span-2 space-y-8">
            <BudgetOverview 
              categories={formattedBudgetCategories}
              totalIncome={totalIncome}
            />
            
            <QuickActions
              onAddExpense={addExpense}
              onAddIncome={addIncome}
              onAddGoal={addGoal}
            />

            <GoalsTracker 
              goals={formattedGoals}
              onUpdateGoal={updateGoalProgress}
            />
          </div>

          {/* Right Column - AI Assistant */}
          <div className="space-y-8">
            <AIAssistant 
              financialData={{
                totalIncome,
                totalExpenses,
                budgetCategories: formattedBudgetCategories,
                goals: formattedGoals
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

                {totalIncome === 0 && totalExpenses === 0 && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      👋 Welcome to BudgetBot! Start by adding your income and expenses to get personalized insights.
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
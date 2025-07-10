import { useFinancialInsights } from "./useFinancialInsights";
import type { FinancialData } from "@/types/financial";

export function useAIResponseHandlers(financialData: FinancialData) {
  const insights = useFinancialInsights(financialData);

  const handleAnalysisQuery = (): string => {
    const budgetHealth = insights.savingsRate > 20 ? 'Excellent' : insights.savingsRate > 10 ? 'Good' : 'Needs Improvement';
    const topSpender = insights.spendingByCategory.reduce((max, cat) => cat.spent > max.spent ? cat : max, insights.spendingByCategory[0]);
    
    return `📊 **Financial Health: ${budgetHealth}**\n\n💰 You're saving ${insights.savingsRate}% (₹${insights.remainingBudget.toLocaleString()}) of your ₹${financialData.totalIncome.toLocaleString()} income.\n\n📈 Highest expense: ${topSpender.name} (${topSpender.percentage}%)\n\n🎯 Goals Progress: ${financialData.goals.filter(g => g.currentAmount > 0).length}/${insights.totalGoals} goals active\n\n💡 Quick tip: ${insights.savingsRate < 20 ? 'Try to increase savings by 5% monthly' : 'Consider diversifying investments for better returns'}`;
  };

  const handleBudgetQuery = (): string => {
    const budgetCategories = financialData.budgetCategories;
    const needsCategory = budgetCategories.find(cat => cat.name.includes('Needs'));
    const wantsCategory = budgetCategories.find(cat => cat.name.includes('Wants'));
    
    return `📊 **Budget Analysis:**\n\n🏠 Needs: ₹${needsCategory.spent.toLocaleString()}/₹${needsCategory.budget.toLocaleString()} (${Math.round((needsCategory.spent/needsCategory.budget)*100)}%)\n🎯 Wants: ₹${wantsCategory.spent.toLocaleString()}/₹${wantsCategory.budget.toLocaleString()} (${Math.round((wantsCategory.spent/wantsCategory.budget)*100)}%)\n\n${insights.savingsRate > 20 ? '✅ Great budgeting! Consider investing surplus.' : insights.savingsRate > 0 ? '⚠️ Good start. Try the 50/30/20 rule.' : '🚨 Overspending detected. Review expenses immediately.'}`;
  };

  const handleGoalsQuery = (): string => {
    if (insights.totalGoals > 0) {
      const activeGoals = financialData.goals.filter(g => g.currentAmount < g.targetAmount);
      const completedGoals = financialData.goals.filter(g => g.currentAmount >= g.targetAmount);
      
      return `🎯 **Goals Overview:**\n\n✅ Completed: ${completedGoals.length}\n🔄 Active: ${activeGoals.length}\n💰 Total Target: ₹${insights.totalGoalAmount.toLocaleString()}\n\n${activeGoals.length > 0 ? `Next milestone: ${activeGoals[0].name} (${Math.round((activeGoals[0].currentAmount/activeGoals[0].targetAmount)*100)}% done)` : 'All goals achieved! Time to set new ones.'}`;
    } else {
      return `🎯 **Start Your Financial Journey!**\n\nRecommended first goals:\n• Emergency Fund: ₹${Math.round(financialData.totalExpenses * 6).toLocaleString()} (6 months expenses)\n• Health Insurance: ₹50,000\n• Investment Goal: ₹25,000\n\nSet SMART goals with deadlines for better success!`;
    }
  };

  const handleInvestmentQuery = (): string => {
    const monthlyInvestment = Math.round(insights.remainingBudget * 0.7);
    return `💹 **Investment Strategy:**\n\n💰 Available for investment: ₹${monthlyInvestment.toLocaleString()}/month\n\n🔰 Beginner Portfolio:\n• Large Cap Mutual Funds: 40%\n• Mid/Small Cap: 30%\n• Debt Funds: 20%\n• Gold/International: 10%\n\n📈 Start with ₹${Math.min(monthlyInvestment, 10000).toLocaleString()}/month SIP and increase by 10% annually.`;
  };

  const handleSavingsQuery = (): string => {
    const targetSavings = Math.round(financialData.totalIncome * 0.2);
    const currentSavings = insights.remainingBudget;
    const deficit = targetSavings - currentSavings;
    
    return `💰 **Savings Optimization:**\n\n🎯 Target (20%): ₹${targetSavings.toLocaleString()}\n💵 Current: ₹${currentSavings.toLocaleString()}\n${deficit > 0 ? `📉 Shortfall: ₹${deficit.toLocaleString()}` : `📈 Surplus: ₹${Math.abs(deficit).toLocaleString()}`}\n\n💡 Tips: ${deficit > 0 ? 'Reduce dining out by 25%, cancel unused subscriptions' : 'Great! Consider increasing investment allocation'}`;
  };

  const handleDebtQuery = (): string => {
    return `💳 **Debt Management Strategy:**\n\n🔴 High Priority: Credit Card debt (18-24% interest)\n🟡 Medium: Personal Loans (12-16%)\n🟢 Low: Home Loans (8-10%)\n\n📋 Action Plan:\n1. List all debts with interest rates\n2. Pay minimums on all\n3. Extra payment to highest interest debt\n4. Consider debt consolidation if multiple high-interest debts`;
  };

  const handleDefaultQuery = (): string => {
    return `🤖 **How can I help optimize your finances?**\n\n📊 Current Status: ${insights.savingsRate}% savings rate\n💰 Monthly Surplus: ₹${insights.remainingBudget.toLocaleString()}\n\nI can help with:\n• Budget optimization\n• Investment strategies\n• Goal planning\n• Debt management\n• Tax planning\n\nAsk me anything specific about your ₹${financialData.totalIncome.toLocaleString()} monthly income management!`;
  };

  return {
    handleAnalysisQuery,
    handleBudgetQuery,
    handleGoalsQuery,
    handleInvestmentQuery,
    handleSavingsQuery,
    handleDebtQuery,
    handleDefaultQuery
  };
}
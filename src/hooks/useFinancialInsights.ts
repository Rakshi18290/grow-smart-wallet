interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  budgetCategories: any[];
  goals: any[];
}

interface FinancialInsights {
  savingsRate: number;
  remainingBudget: number;
  totalGoals: number;
  totalGoalAmount: number;
  spendingByCategory: Array<{
    name: string;
    spent: number;
    percentage: number;
  }>;
}

export function useFinancialInsights(financialData: FinancialData): FinancialInsights {
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
}
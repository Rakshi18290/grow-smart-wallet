export interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  budgetCategories: any[];
  goals: any[];
}

export interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
}

export interface Goal {
  name: string;
  currentAmount: number;
  targetAmount: number;
}
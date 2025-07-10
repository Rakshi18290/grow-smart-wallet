import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getFinancialData,
  getBudgetCategories,
  getGoals,
  getTransactions,
  subscribeToFinancialData,
  subscribeToGoals,
  subscribeToBudgetCategories,
  createOrUpdateFinancialData,
  createTransaction,
  updateGoal,
  createGoal
} from '@/services/database';
import type { 
  UserFinancialData, 
  BudgetCategory, 
  Goal, 
  Transaction 
} from '@/types/database';

interface UseUserFinancialDataReturn {
  financialData: UserFinancialData | null;
  budgetCategories: BudgetCategory[];
  goals: Goal[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: { amount: number; description: string; category?: string }) => Promise<void>;
  addIncome: (income: { amount: number; description: string; category?: string }) => Promise<void>;
  addGoal: (goal: { name: string; targetAmount: number; deadline: string; description: string }) => Promise<void>;
  updateGoalProgress: (goalId: string, amount: number) => Promise<void>;
  updateFinancialData: (data: Partial<Omit<UserFinancialData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
}

export function useUserFinancialData(): UseUserFinancialDataReturn {
  const { currentUser } = useAuth();
  const [financialData, setFinancialData] = useState<UserFinancialData | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    let unsubscribeFinancial: (() => void) | undefined;
    let unsubscribeGoals: (() => void) | undefined;
    let unsubscribeCategories: (() => void) | undefined;

    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load initial data
        const [initialFinancialData, initialCategories, initialGoals, initialTransactions] = await Promise.all([
          getFinancialData(currentUser.uid),
          getBudgetCategories(currentUser.uid),
          getGoals(currentUser.uid),
          getTransactions(currentUser.uid, 50) // Get last 50 transactions
        ]);

        setFinancialData(initialFinancialData);
        setBudgetCategories(initialCategories);
        setGoals(initialGoals);
        setTransactions(initialTransactions);

        // Set up real-time listeners
        unsubscribeFinancial = subscribeToFinancialData(currentUser.uid, setFinancialData);
        unsubscribeGoals = subscribeToGoals(currentUser.uid, setGoals);
        unsubscribeCategories = subscribeToBudgetCategories(currentUser.uid, setBudgetCategories);

      } catch (err) {
        console.error('Error loading financial data:', err);
        setError('Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Cleanup listeners on unmount
    return () => {
      unsubscribeFinancial?.();
      unsubscribeGoals?.();
      unsubscribeCategories?.();
    };
  }, [currentUser]);

  const addExpense = async (expense: { amount: number; description: string; category?: string }) => {
    if (!currentUser || !financialData) return;

    try {
      // Create transaction
      await createTransaction(currentUser.uid, {
        type: 'expense',
        amount: expense.amount,
        description: expense.description,
        category: expense.category
      });

      // Update financial data
      await createOrUpdateFinancialData(currentUser.uid, {
        ...financialData,
        totalExpenses: financialData.totalExpenses + expense.amount
      });

      // Reload transactions
      const updatedTransactions = await getTransactions(currentUser.uid, 50);
      setTransactions(updatedTransactions);

    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense');
    }
  };

  const addIncome = async (income: { amount: number; description: string; category?: string }) => {
    if (!currentUser || !financialData) return;

    try {
      // Create transaction
      await createTransaction(currentUser.uid, {
        type: 'income',
        amount: income.amount,
        description: income.description,
        category: income.category
      });

      // Update financial data
      await createOrUpdateFinancialData(currentUser.uid, {
        ...financialData,
        totalIncome: financialData.totalIncome + income.amount
      });

      // Reload transactions
      const updatedTransactions = await getTransactions(currentUser.uid, 50);
      setTransactions(updatedTransactions);

    } catch (err) {
      console.error('Error adding income:', err);
      setError('Failed to add income');
    }
  };

  const addGoal = async (goal: { name: string; targetAmount: number; deadline: string; description: string }) => {
    if (!currentUser) return;

    try {
      await createGoal(currentUser.uid, {
        ...goal,
        currentAmount: 0
      });
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal');
    }
  };

  const updateGoalProgress = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      await updateGoal(goalId, { currentAmount: newAmount });
    } catch (err) {
      console.error('Error updating goal:', err);
      setError('Failed to update goal');
    }
  };

  const updateFinancialData = async (data: Partial<Omit<UserFinancialData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) => {
    if (!currentUser) return;

    try {
      await createOrUpdateFinancialData(currentUser.uid, {
        totalIncome: financialData?.totalIncome || 0,
        totalExpenses: financialData?.totalExpenses || 0,
        totalSavings: financialData?.totalSavings || 0,
        totalDebt: financialData?.totalDebt || 0,
        ...data
      });
    } catch (err) {
      console.error('Error updating financial data:', err);
      setError('Failed to update financial data');
    }
  };

  return {
    financialData,
    budgetCategories,
    goals,
    transactions,
    loading,
    error,
    addExpense,
    addIncome,
    addGoal,
    updateGoalProgress,
    updateFinancialData
  };
}
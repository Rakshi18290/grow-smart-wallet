import type { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BudgetCategory {
  id: string;
  name: string;
  spent: number;
  budget: number;
  color: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  userId: string;
  createdAt: Timestamp;
}

export interface UserFinancialData {
  id: string;
  userId: string;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  totalDebt: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPreferences {
  id: string;
  userId: string;
  currency: string;
  locale: string;
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    budgetAlerts: boolean;
    goalReminders: boolean;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
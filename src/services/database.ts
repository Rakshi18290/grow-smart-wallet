import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  User,
  BudgetCategory,
  Goal,
  Transaction,
  UserFinancialData,
  UserPreferences
} from '@/types/database';

// User operations
export const createUser = async (userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
  const userDoc = {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  const docRef = doc(db, 'users', userId);
  await setDoc(docRef, userDoc);
  return userId;
};

export const getUser = async (userId: string) => {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
};

export const updateUser = async (userId: string, updates: Partial<User>) => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Financial data operations
export const createOrUpdateFinancialData = async (
  userId: string, 
  data: Omit<UserFinancialData, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
  const financialDataQuery = query(
    collection(db, 'financialData'),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(financialDataQuery);
  
  if (snapshot.empty) {
    // Create new financial data
    const docRef = await addDoc(collection(db, 'financialData'), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } else {
    // Update existing financial data
    const existingDoc = snapshot.docs[0];
    await updateDoc(existingDoc.ref, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return existingDoc.id;
  }
};

export const getFinancialData = async (userId: string) => {
  const financialDataQuery = query(
    collection(db, 'financialData'),
    where('userId', '==', userId)
  );
  
  const snapshot = await getDocs(financialDataQuery);
  
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as UserFinancialData;
  }
  return null;
};

// Budget category operations
export const getBudgetCategories = async (userId: string) => {
  const categoriesQuery = query(
    collection(db, 'budgetCategories'),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );
  
  const snapshot = await getDocs(categoriesQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BudgetCategory[];
};

export const createBudgetCategory = async (
  userId: string,
  categoryData: Omit<BudgetCategory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
  const docRef = await addDoc(collection(db, 'budgetCategories'), {
    ...categoryData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateBudgetCategory = async (categoryId: string, updates: Partial<BudgetCategory>) => {
  const docRef = doc(db, 'budgetCategories', categoryId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteBudgetCategory = async (categoryId: string) => {
  const docRef = doc(db, 'budgetCategories', categoryId);
  await deleteDoc(docRef);
};

// Goal operations
export const getGoals = async (userId: string) => {
  const goalsQuery = query(
    collection(db, 'goals'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(goalsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Goal[];
};

export const createGoal = async (
  userId: string,
  goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) => {
  const docRef = await addDoc(collection(db, 'goals'), {
    ...goalData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
  const docRef = doc(db, 'goals', goalId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteGoal = async (goalId: string) => {
  const docRef = doc(db, 'goals', goalId);
  await deleteDoc(docRef);
};

// Transaction operations
export const getTransactions = async (userId: string, limit?: number) => {
  let transactionsQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  if (limit) {
    // Note: You might need to import 'limit' from firebase/firestore
    // transactionsQuery = query(transactionsQuery, limit(limit));
  }
  
  const snapshot = await getDocs(transactionsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
};

export const createTransaction = async (
  userId: string,
  transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>
) => {
  const docRef = await addDoc(collection(db, 'transactions'), {
    ...transactionData,
    userId,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const deleteTransaction = async (transactionId: string) => {
  const docRef = doc(db, 'transactions', transactionId);
  await deleteDoc(docRef);
};

// Real-time listeners
export const subscribeToFinancialData = (userId: string, callback: (data: UserFinancialData | null) => void) => {
  const financialDataQuery = query(
    collection(db, 'financialData'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(financialDataQuery, (snapshot) => {
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      callback({ id: doc.id, ...doc.data() } as UserFinancialData);
    } else {
      callback(null);
    }
  });
};

export const subscribeToGoals = (userId: string, callback: (goals: Goal[]) => void) => {
  const goalsQuery = query(
    collection(db, 'goals'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(goalsQuery, (snapshot) => {
    const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Goal[];
    callback(goals);
  });
};

export const subscribeToBudgetCategories = (userId: string, callback: (categories: BudgetCategory[]) => void) => {
  const categoriesQuery = query(
    collection(db, 'budgetCategories'),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );
  
  return onSnapshot(categoriesQuery, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BudgetCategory[];
    callback(categories);
  });
};

// Initialize default data for new users
export const initializeUserData = async (userId: string, userEmail: string) => {
  // Create default financial data
  await createOrUpdateFinancialData(userId, {
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    totalDebt: 0
  });

  // Create default budget categories
  const defaultCategories = [
    {
      name: "Needs (Housing, Food, Transport)",
      spent: 0,
      budget: 0,
      color: "bg-primary"
    },
    {
      name: "Wants (Entertainment, Shopping)",
      spent: 0,
      budget: 0,
      color: "bg-warning"
    },
    {
      name: "Savings & Investments",
      spent: 0,
      budget: 0,
      color: "bg-success"
    }
  ];

  for (const category of defaultCategories) {
    await createBudgetCategory(userId, category);
  }

  // Create default goals
  const defaultGoals = [
    {
      name: "Emergency Fund",
      targetAmount: 100000,
      currentAmount: 0,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      description: "6 months of expenses for financial security"
    }
  ];

  for (const goal of defaultGoals) {
    await createGoal(userId, goal);
  }
};
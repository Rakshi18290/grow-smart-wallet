import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, TrendingUp, Target, CreditCard } from "lucide-react";
import { useState } from "react";

interface QuickActionsProps {
  onAddExpense: (expense: any) => void;
  onAddIncome: (income: any) => void;
  onAddGoal: (goal: any) => void;
}

export function QuickActions({ onAddExpense, onAddIncome, onAddGoal }: QuickActionsProps) {
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [incomeForm, setIncomeForm] = useState({
    amount: "",
    source: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: ""
  });

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Other"
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Rental",
    "Other"
  ];

  const handleAddExpense = () => {
    if (expenseForm.amount && expenseForm.category) {
      onAddExpense({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        id: Date.now(),
        type: 'expense'
      });
      setExpenseForm({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleAddIncome = () => {
    if (incomeForm.amount && incomeForm.source) {
      onAddIncome({
        ...incomeForm,
        amount: parseFloat(incomeForm.amount),
        id: Date.now(),
        type: 'income'
      });
      setIncomeForm({
        amount: "",
        source: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleAddGoal = () => {
    if (goalForm.name && goalForm.targetAmount) {
      onAddGoal({
        ...goalForm,
        targetAmount: parseFloat(goalForm.targetAmount),
        currentAmount: parseFloat(goalForm.currentAmount) || 0,
        id: Date.now()
      });
      setGoalForm({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        description: ""
      });
    }
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add Expense */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <CreditCard className="h-6 w-6 text-destructive" />
              <span>Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expense-amount">Amount (₹)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expense-category">Category</Label>
                <Select value={expenseForm.category} onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expense-description">Description</Label>
                <Input
                  id="expense-description"
                  placeholder="What did you spend on?"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expense-date">Date</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                />
              </div>
              <Button onClick={handleAddExpense} className="w-full" variant="destructive">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Income */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <TrendingUp className="h-6 w-6 text-success" />
              <span>Add Income</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="income-amount">Amount (₹)</Label>
                <Input
                  id="income-amount"
                  type="number"
                  placeholder="0.00"
                  value={incomeForm.amount}
                  onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="income-source">Source</Label>
                <Select value={incomeForm.source} onValueChange={(value) => setIncomeForm({...incomeForm, source: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income source" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="income-description">Description</Label>
                <Input
                  id="income-description"
                  placeholder="Income details"
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="income-date">Date</Label>
                <Input
                  id="income-date"
                  type="date"
                  value={incomeForm.date}
                  onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})}
                />
              </div>
              <Button onClick={handleAddIncome} className="w-full" variant="success">
                Add Income
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Goal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Target className="h-6 w-6 text-primary" />
              <span>Set Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund, Vacation"
                  value={goalForm.name}
                  onChange={(e) => setGoalForm({...goalForm, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goal-target">Target Amount (₹)</Label>
                  <Input
                    id="goal-target"
                    type="number"
                    placeholder="0.00"
                    value={goalForm.targetAmount}
                    onChange={(e) => setGoalForm({...goalForm, targetAmount: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="goal-current">Current Amount (₹)</Label>
                  <Input
                    id="goal-current"
                    type="number"
                    placeholder="0.00"
                    value={goalForm.currentAmount}
                    onChange={(e) => setGoalForm({...goalForm, currentAmount: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="goal-deadline">Target Date</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({...goalForm, deadline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Why is this goal important to you?"
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({...goalForm, description: e.target.value})}
                />
              </div>
              <Button onClick={handleAddGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
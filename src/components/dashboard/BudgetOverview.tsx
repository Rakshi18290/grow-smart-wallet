import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface BudgetCategory {
  name: string;
  spent: number;
  budget: number;
  color: string;
}

interface BudgetOverviewProps {
  categories: BudgetCategory[];
  totalIncome: number;
}

export function BudgetOverview({ categories, totalIncome }: BudgetOverviewProps) {
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const remaining = totalIncome - totalSpent;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
        <div className="text-sm text-muted-foreground">
          ₹{totalSpent.toLocaleString()} of ₹{totalBudget.toLocaleString()} spent
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Budget Usage</span>
            <span className="font-medium">
              {Math.round((totalSpent / totalBudget) * 100)}%
            </span>
          </div>
          <Progress 
            value={(totalSpent / totalBudget) * 100} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₹{totalSpent.toLocaleString()} spent</span>
            <span>₹{(totalBudget - totalSpent).toLocaleString()} remaining</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Category Breakdown</h4>
          {categories.map((category, index) => {
            const percentage = (category.spent / category.budget) * 100;
            const isOverBudget = percentage > 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div 
                      className={cn("w-3 h-3 rounded-full", category.color)}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ₹{category.spent.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      of ₹{category.budget.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={cn(
                    "h-2",
                    isOverBudget && "bg-destructive-muted"
                  )}
                />
                <div className="flex justify-between text-xs">
                  <span className={cn(
                    "font-medium",
                    isOverBudget ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {Math.round(percentage)}%
                  </span>
                  {isOverBudget && (
                    <span className="text-destructive font-medium">
                      ₹{(category.spent - category.budget).toLocaleString()} over budget
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Remaining Balance</span>
            <span className={cn(
              "text-lg font-bold",
              remaining >= 0 ? "text-success" : "text-destructive"
            )}>
              ₹{Math.abs(remaining).toLocaleString()}
            </span>
          </div>
          {remaining < 0 && (
            <p className="text-xs text-destructive mt-1">
              You're ₹{Math.abs(remaining).toLocaleString()} over your budget this month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
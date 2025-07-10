import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
}

interface GoalsTrackerProps {
  goals: Goal[];
  onUpdateGoal: (goalId: number, amount: number) => void;
}

export function GoalsTracker({ goals, onUpdateGoal }: GoalsTrackerProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  
  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { text: "Overdue", color: "text-destructive" };
    if (daysDiff === 0) return { text: "Today", color: "text-warning" };
    if (daysDiff === 1) return { text: "1 day left", color: "text-warning" };
    if (daysDiff <= 7) return { text: `${daysDiff} days left`, color: "text-warning" };
    if (daysDiff <= 30) return { text: `${daysDiff} days left`, color: "text-primary" };
    
    const monthsDiff = Math.ceil(daysDiff / 30);
    return { text: `${monthsDiff} months left`, color: "text-muted-foreground" };
  };

  const getProgressStatus = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return { status: "completed", color: "bg-success" };
    if (percentage >= 75) return { status: "almost-there", color: "bg-primary" };
    if (percentage >= 50) return { status: "halfway", color: "bg-warning" };
    return { status: "started", color: "bg-muted-foreground" };
  };

  if (goals.length === 0) {
    return (
      <Card className="shadow-card hover:shadow-card-hover transition-smooth">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Goals Set</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start by setting your first financial goal to track your progress
          </p>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Goal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Financial Goals
          </CardTitle>
          <Badge variant="secondary">
            {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals.map((goal) => {
          const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const remaining = goal.targetAmount - goal.currentAmount;
          const timeRemaining = getTimeRemaining(goal.deadline);
          const progressStatus = getProgressStatus(goal.currentAmount, goal.targetAmount);
          
          return (
            <div key={goal.id} className="space-y-4 p-4 border border-border rounded-lg">
              {/* Goal Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{goal.name}</h4>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </div>
                <Badge 
                  variant={progressStatus.status === "completed" ? "default" : "secondary"}
                  className={cn(
                    progressStatus.status === "completed" && "bg-success text-success-foreground"
                  )}
                >
                  {Math.round(percentage)}%
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress 
                  value={percentage} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {formatCurrency(goal.currentAmount)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {/* Goal Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={timeRemaining.color}>
                    {timeRemaining.text}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Goal achieved!'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              {remaining > 0 && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdateGoal(goal.id, 1000)}
                  >
                    +₹1,000
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdateGoal(goal.id, 5000)}
                  >
                    +₹5,000
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onUpdateGoal(goal.id, 10000)}
                  >
                    +₹10,000
                  </Button>
                </div>
              )}

              {/* Achievement Banner */}
              {percentage >= 100 && (
                <div className="bg-success-muted border border-success rounded-lg p-3">
                  <div className="flex items-center gap-2 text-success">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Congratulations! Goal achieved!</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Summary */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Goals Value</span>
              <div className="text-lg font-semibold">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.targetAmount, 0))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Saved</span>
              <div className="text-lg font-semibold text-success">
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.currentAmount, 0))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
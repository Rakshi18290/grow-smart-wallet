import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  variant = "default"
}: DashboardCardProps) {
  const variantStyles = {
    default: "border-l-4 border-l-primary",
    success: "border-l-4 border-l-success",
    warning: "border-l-4 border-l-warning",
    destructive: "border-l-4 border-l-destructive"
  };

  return (
    <Card className={cn(
      "shadow-card hover:shadow-card-hover transition-smooth",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "h-4 w-4",
            variant === "success" && "text-success",
            variant === "warning" && "text-warning",
            variant === "destructive" && "text-destructive",
            variant === "default" && "text-primary"
          )}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value || value === 0 ? value : "Loading..."}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
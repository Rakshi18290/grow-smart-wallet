import { Bot } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <Bot className="h-12 w-12 text-white mx-auto animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">BudgetBot</h2>
        <p className="text-blue-100">Loading your financial dashboard...</p>
        <div className="mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
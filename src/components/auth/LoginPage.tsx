import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Mail, Shield, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      toast({
        title: "Welcome to BudgetBot!",
        description: "You've successfully signed in. Let's manage your finances together.",
      });
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: "There was an error signing you in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="h-12 w-12 text-white" />
            <h1 className="text-4xl font-bold text-white">BudgetBot</h1>
          </div>
          <p className="text-blue-100 text-lg">
            Your AI-Powered Financial Assistant
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>
              Sign in with your Google account to access your personalized financial dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-lg"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {/* Features */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold text-center text-muted-foreground">
                What you'll get:
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-sm">Personal financial insights & analytics</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm">AI-powered financial advice</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Secure cloud storage for your data</span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Your financial data is encrypted and stored securely. We never share your information with third parties.
            </div>
          </CardContent>
        </Card>

        {/* Demo Note */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            🔒 This is a demo app. Your data will be stored in a test database.
          </p>
        </div>
      </div>
    </div>
  );
}
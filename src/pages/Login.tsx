import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Leaf, Recycle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  const demoAccounts = [
    { email: 'john@example.com', role: 'User', name: 'John Doe' },
    { email: 'jane@example.com', role: 'User', name: 'Jane Smith' },
    { email: 'admin@example.com', role: 'Admin', name: 'Admin User' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center eco-gradient-subtle p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="eco-gradient p-3 rounded-full">
              <Recycle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-eco-dark">EcoWaste</h1>
          </div>
          <p className="text-muted-foreground">
            Join the green revolution - Manage waste, earn rewards
          </p>
        </div>

        {/* Login Form */}
        <Card className="eco-shadow">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full eco-gradient"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
            <CardDescription className="text-xs">
              Click to auto-fill credentials (password: any)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setEmail(account.email);
                  setPassword('demo');
                }}
              >
                <div className="flex items-center gap-2">
                  {account.role === 'Admin' ? (
                    <Globe className="h-4 w-4 text-eco-warning" />
                  ) : (
                    <Leaf className="h-4 w-4 text-eco-green" />
                  )}
                  <span className="text-xs">
                    {account.name} ({account.role})
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-eco-light">
              <Recycle className="h-5 w-5 text-eco-green" />
            </div>
            <span className="text-xs text-muted-foreground">Report Issues</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-eco-light">
              <Leaf className="h-5 w-5 text-eco-green" />
            </div>
            <span className="text-xs text-muted-foreground">Earn Credits</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 rounded-full bg-eco-light">
              <Globe className="h-5 w-5 text-eco-green" />
            </div>
            <span className="text-xs text-muted-foreground">Go Green</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
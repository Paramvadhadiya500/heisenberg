import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Recycle, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(loginData.email, loginData.password);
    
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await signup(signupData.email, signupData.password, signupData.name);
    
    if (success) {
      // User will be logged in automatically after email verification
      setSignupData({ name: '', email: '', password: '' });
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

        {/* Auth Forms */}
        <Card className="eco-shadow">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Create Account</h2>
                  <p className="text-sm text-muted-foreground">Join the eco-friendly community</p>
                </div>
                
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full eco-gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts (For Testing)</CardTitle>
            <CardDescription className="text-xs">
              Click to auto-fill login credentials
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
                  setLoginData({ email: account.email, password: 'demo123' });
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
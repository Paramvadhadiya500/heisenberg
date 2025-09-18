import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Gift, 
  Plus, 
  Star, 
  User,
  Ticket,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: number;
  name: string;
  email: string;
  credits: number;
}

interface RedeemCode {
  id: number;
  code: string;
  userId: number;
  createdAt: string;
  redeemed: boolean;
}

const CreditsManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, codesRes] = await Promise.all([
        axios.get('http://localhost:3001/api/users'),
        axios.get('http://localhost:3001/api/redeem-codes')
      ]);
      
      setUsers(usersRes.data);
      setRedeemCodes(codesRes.data);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !creditsToAdd) return;

    const credits = parseInt(creditsToAdd);
    if (credits <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a positive number of credits.",
        variant: "destructive"
      });
      return;
    }

    setIsAdding(true);
    
    try {
      const response = await axios.post(`http://localhost:3001/api/users/${selectedUser.id}/credits`, {
        credits
      });

      if (response.data.success) {
        setUsers(users.map(u => 
          u.id === selectedUser.id 
            ? { ...u, credits: u.credits + credits }
            : u
        ));
        
        toast({
          title: "Credits added successfully!",
          description: `Added ${credits} credits to ${selectedUser.name}'s account.`,
        });
        
        setCreditsToAdd('');
        setSelectedUser(null);
      }
    } catch (error) {
      toast({
        title: "Error adding credits",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const getUserLevel = (credits: number) => {
    if (credits >= 200) return { name: 'Eco Champion', color: 'text-yellow-500' };
    if (credits >= 100) return { name: 'Green Hero', color: 'text-eco-green' };
    if (credits >= 50) return { name: 'Eco Warrior', color: 'text-eco-accent' };
    return { name: 'Green Beginner', color: 'text-muted-foreground' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-eco-dark">Credits Management</h2>
          <p className="text-muted-foreground mt-2">Loading user credits...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-eco-dark">Credits Management</h2>
          <p className="text-muted-foreground mt-2">
            Manage user credits and track reward redemptions
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="eco-gradient">
              <Plus className="h-4 w-4 mr-2" />
              Add Credits
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Credits to User</DialogTitle>
            </DialogHeader>
            <AddCreditsForm
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              creditsToAdd={creditsToAdd}
              setCreditsToAdd={setCreditsToAdd}
              onSubmit={handleAddCredits}
              isLoading={isAdding}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-green">
              {users.reduce((total, user) => total + user.credits, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Credits</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-accent">
              {users.filter(u => u.credits >= 100).length}
            </div>
            <p className="text-sm text-muted-foreground">Eligible for Rewards</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-warning">
              {redeemCodes.length}
            </div>
            <p className="text-sm text-muted-foreground">Codes Generated</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {Math.round(users.reduce((total, user) => total + user.credits, 0) / users.length) || 0}
            </div>
            <p className="text-sm text-muted-foreground">Avg Credits/User</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="eco-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-eco-green" />
              User Credits
            </CardTitle>
            <CardDescription>
              Current credit balance for all users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {users.map((user) => {
              const level = getUserLevel(user.credits);
              return (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-eco-light">
                      <User className="h-4 w-4 text-eco-green" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-eco-green" />
                      <span className="font-bold text-eco-green">{user.credits}</span>
                    </div>
                    <Badge variant="outline" className={level.color}>
                      {level.name}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Redeem Codes */}
        <Card className="eco-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-eco-warning" />
              Recent Redemptions
            </CardTitle>
            <CardDescription>
              Latest reward codes generated by users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {redeemCodes.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No redemption codes generated yet
                </p>
              </div>
            ) : (
              redeemCodes.slice(0, 5).map((code) => {
                const user = users.find(u => u.id === code.userId);
                return (
                  <div key={code.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium font-mono">{code.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.name || `User ${code.userId}`}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(code.createdAt)}
                      </p>
                      <Badge variant={code.redeemed ? "default" : "secondary"}>
                        {code.redeemed ? "Used" : "Active"}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
            
            {redeemCodes.length > 5 && (
              <Button variant="outline" className="w-full">
                <History className="h-4 w-4 mr-2" />
                View All Redemptions
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add Credits Form Component
const AddCreditsForm: React.FC<{
  users: User[];
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  creditsToAdd: string;
  setCreditsToAdd: (credits: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}> = ({ users, selectedUser, setSelectedUser, creditsToAdd, setCreditsToAdd, onSubmit, isLoading }) => {
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Select User</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {users.map((user) => (
            <Button
              key={user.id}
              type="button"
              variant={selectedUser?.id === user.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedUser(user)}
            >
              <User className="h-4 w-4 mr-2" />
              {user.name} ({user.credits} credits)
            </Button>
          ))}
        </div>
      </div>

      {selectedUser && (
        <div className="space-y-2">
          <Label htmlFor="credits">Credits to Add</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            value={creditsToAdd}
            onChange={(e) => setCreditsToAdd(e.target.value)}
            placeholder="Enter number of credits"
            required
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full eco-gradient"
        disabled={!selectedUser || !creditsToAdd || isLoading}
      >
        {isLoading ? 'Adding Credits...' : 'Add Credits'}
      </Button>
    </form>
  );
};

export default CreditsManager;
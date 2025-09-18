import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  MapPin, 
  Clock, 
  User, 
  Eye,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Complaint {
  id: number;
  userId: number;
  name: string;
  location: string;
  description: string;
  photo?: string;
  status: 'pending' | 'assigned' | 'completed' | 'cancelled';
  assignedWorker?: {
    id: number;
    name: string;
    phone: string;
    area: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Worker {
  id: number;
  name: string;
  phone: string;
  area: string;
}

const ComplaintsManager = () => {
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningTo, setAssigningTo] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [complaintsRes, workersRes] = await Promise.all([
        axios.get('http://localhost:3001/api/complaints?role=admin'),
        axios.get('http://localhost:3001/api/workers')
      ]);
      
      setComplaints(complaintsRes.data);
      setWorkers(workersRes.data);
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

  const handleAssignWorker = async (complaintId: number, workerId: number) => {
    setAssigningTo(complaintId);
    
    try {
      const response = await axios.put(`http://localhost:3001/api/complaints/${complaintId}/assign`, {
        workerId
      });

      if (response.data.success) {
        setComplaints(complaints.map(c => 
          c.id === complaintId ? response.data.complaint : c
        ));
        
        toast({
          title: "Worker assigned successfully!",
          description: "The complaint has been assigned to a worker.",
        });
      }
    } catch (error) {
      toast({
        title: "Error assigning worker",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setAssigningTo(null);
    }
  };

  const updateComplaintStatus = async (complaintId: number, status: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/complaints/${complaintId}/status`, {
        status
      });

      if (response.data.success) {
        setComplaints(complaints.map(c => 
          c.id === complaintId ? response.data.complaint : c
        ));
        
        toast({
          title: "Status updated",
          description: `Complaint status changed to ${status}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const, icon: Clock },
      assigned: { label: 'Assigned', variant: 'default' as const, icon: User },
      completed: { label: 'Completed', variant: 'default' as const, icon: UserCheck },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
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
          <h2 className="text-3xl font-bold text-eco-dark">Complaints Management</h2>
          <p className="text-muted-foreground mt-2">Loading complaints...</p>
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
      <div>
        <h2 className="text-3xl font-bold text-eco-dark">Complaints Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage waste reports and assign workers to resolve issues
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-green">
              {complaints.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-accent">
              {complaints.filter(c => c.status === 'assigned').length}
            </div>
            <p className="text-sm text-muted-foreground">Assigned</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-success">
              {complaints.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {complaints.length}
            </div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <Card className="eco-shadow">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Complaints</h3>
            <p className="text-muted-foreground">
              No waste reports have been submitted yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="eco-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-eco-green" />
                      Complaint #{complaint.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {complaint.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {complaint.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(complaint.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(complaint.status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {complaint.description}
                </p>

                {complaint.assignedWorker && (
                  <div className="bg-eco-light p-3 rounded-lg mb-4">
                    <h4 className="font-medium text-eco-dark mb-2">Assigned Worker:</h4>
                    <div className="text-sm">
                      <p className="font-medium">{complaint.assignedWorker.name}</p>
                      <p className="text-muted-foreground">
                        {complaint.assignedWorker.area} • {complaint.assignedWorker.phone}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Complaint #{complaint.id} - Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Description:</h4>
                          <p className="text-sm text-muted-foreground">{complaint.description}</p>
                        </div>
                        
                        {complaint.photo && (
                          <div>
                            <h4 className="font-medium mb-2">Photo:</h4>
                            <img
                              src={complaint.photo}
                              alt="Complaint"
                              className="max-w-full h-64 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {complaint.status === 'pending' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="eco-gradient">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Assign Worker
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Worker to Complaint #{complaint.id}</DialogTitle>
                        </DialogHeader>
                        <AssignWorkerForm
                          workers={workers}
                          onAssign={(workerId) => handleAssignWorker(complaint.id, workerId)}
                          isLoading={assigningTo === complaint.id}
                        />
                      </DialogContent>
                    </Dialog>
                  )}

                  {complaint.status === 'assigned' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateComplaintStatus(complaint.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Worker Assignment Form Component
const AssignWorkerForm: React.FC<{
  workers: Worker[];
  onAssign: (workerId: number) => void;
  isLoading: boolean;
}> = ({ workers, onAssign, isLoading }) => {
  const [selectedWorker, setSelectedWorker] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorker) {
      onAssign(parseInt(selectedWorker));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup value={selectedWorker} onValueChange={setSelectedWorker}>
        <div className="space-y-3">
          {workers.map((worker) => (
            <div key={worker.id} className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value={worker.id.toString()} id={`worker-${worker.id}`} />
              <Label htmlFor={`worker-${worker.id}`} className="flex-1 cursor-pointer">
                <div>
                  <p className="font-medium">{worker.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {worker.area} • {worker.phone}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      <Button 
        type="submit" 
        className="w-full eco-gradient"
        disabled={!selectedWorker || isLoading}
      >
        {isLoading ? 'Assigning...' : 'Assign Worker'}
      </Button>
    </form>
  );
};

export default ComplaintsManager;
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  User, 
  Eye,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface Report {
  id: number;
  userId: number;
  complaintId: number;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

const ReportsManager = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/reports');
      setReports(response.data);
    } catch (error) {
      toast({
        title: "Error loading reports",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: number, status: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/reports/${reportId}/status`, {
        status
      });

      if (response.data.success) {
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status: status as 'pending' | 'reviewed' | 'resolved' } : r
        ));
        
        toast({
          title: "Status updated",
          description: `Report status changed to ${status}.`,
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
      reviewed: { label: 'Reviewed', variant: 'default' as const, icon: Eye },
      resolved: { label: 'Resolved', variant: 'default' as const, icon: CheckCircle }
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
          <h2 className="text-3xl font-bold text-eco-dark">Reports Management</h2>
          <p className="text-muted-foreground mt-2">Loading worker reports...</p>
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
        <h2 className="text-3xl font-bold text-eco-dark">Reports Management</h2>
        <p className="text-muted-foreground mt-2">
          Review and manage user reports about worker performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-warning">
              {reports.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-accent">
              {reports.filter(r => r.status === 'reviewed').length}
            </div>
            <p className="text-sm text-muted-foreground">Under Review</p>
          </CardContent>
        </Card>
        
        <Card className="eco-shadow">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-eco-success">
              {reports.filter(r => r.status === 'resolved').length}
            </div>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <Card className="eco-shadow">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports</h3>
            <p className="text-muted-foreground">
              No worker reports have been submitted yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="eco-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-eco-warning" />
                      Report #{report.id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        User ID: {report.userId}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Complaint #{report.complaintId}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDate(report.createdAt)}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Issue Description:</h4>
                  <p className="text-sm text-muted-foreground p-3 bg-eco-light rounded-lg">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Report #{report.id} - Full Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Report ID:</strong> #{report.id}
                          </div>
                          <div>
                            <strong>User ID:</strong> {report.userId}
                          </div>
                          <div>
                            <strong>Related Complaint:</strong> #{report.complaintId}
                          </div>
                          <div>
                            <strong>Status:</strong> {getStatusBadge(report.status)}
                          </div>
                          <div>
                            <strong>Submitted:</strong> {formatDate(report.createdAt)}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Full Description:</h4>
                          <div className="p-4 bg-eco-light rounded-lg">
                            <p className="text-sm">{report.description}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {report.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, 'reviewed')}
                      >
                        Mark as Reviewed
                      </Button>
                      
                      <Button
                        size="sm"
                        className="eco-gradient"
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Resolve
                      </Button>
                    </>
                  )}

                  {report.status === 'reviewed' && (
                    <Button
                      size="sm"
                      className="eco-gradient"
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Priority Reports Section */}
      {reports.filter(r => r.status === 'pending').length > 0 && (
        <Card className="eco-shadow border-eco-warning bg-eco-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-eco-warning">
              <AlertTriangle className="h-5 w-5" />
              Priority Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You have {reports.filter(r => r.status === 'pending').length} pending report(s) 
              that require immediate attention. These reports indicate potential issues with 
              worker performance that need to be addressed promptly.
            </p>
            
            <div className="space-y-2">
              <h4 className="font-medium">Recommended Actions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review each report thoroughly</li>
                <li>• Contact workers for clarification if needed</li>
                <li>• Take corrective measures where necessary</li>
                <li>• Follow up with users after resolution</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsManager;
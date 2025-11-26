import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { TicketService, ReservationService } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { TicketStatus, TicketPriority } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const SupportPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.MEDIUM);
  const [selectedReservationId, setSelectedReservationId] = useState<number | undefined>();

  const { data: tickets, loading: loadingTickets, execute: fetchTickets } = useApi(
    () => TicketService.getMy(0, 50)
  );

  const { data: reservations, execute: fetchReservations } = useApi(
    () => ReservationService.getMy(0, 100)
  );

  const { loading: submitting, execute: createTicket } = useApi(
    (data: any) => TicketService.create(data)
  );

  useEffect(() => {
    fetchTickets();
    fetchReservations();
  }, []);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case TicketStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case TicketStatus.RESOLVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case TicketStatus.CLOSED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.URGENT:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case TicketPriority.HIGH:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case TicketPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case TicketPriority.LOW:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      await createTicket({
        subject: subject.trim(),
        description: description.trim(),
        priority,
        reservationId: selectedReservationId,
      });
      toast.success('Support ticket created successfully');
      setIsCreateDialogOpen(false);
      setSubject('');
      setDescription('');
      setPriority(TicketPriority.MEDIUM);
      setSelectedReservationId(undefined);
      fetchTickets();
    } catch (error) {
      toast.error('Failed to create support ticket');
    }
  };

  const openTickets = tickets?.content.filter(t => 
    t.status === TicketStatus.OPEN || t.status === TicketStatus.IN_PROGRESS
  ) || [];

  if (loadingTickets) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Get help with your reservations and services
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets?.content.filter(t => t.status === TicketStatus.OPEN).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets?.content.filter(t => t.status === TicketStatus.IN_PROGRESS).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tickets?.content.filter(t => t.status === TicketStatus.RESOLVED).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets?.totalElements || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Open Tickets */}
      {openTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Tickets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 border rounded-lg space-y-2 hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{ticket.subject}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                    {ticket.reservation && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Related to: {ticket.reservation.service.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-xs mt-1">#{ticket.id}</p>
                  </div>
                </div>
                {ticket.assignedAdmin && (
                  <p className="text-xs text-muted-foreground">
                    Assigned to: {ticket.assignedAdmin.firstName} {ticket.assignedAdmin.lastName}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets?.content.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No support tickets yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                Create Your First Ticket
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets?.content.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border rounded-lg space-y-2 hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>{format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</p>
                      <p className="text-xs mt-1">#{ticket.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll help you resolve it
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TicketPriority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TicketPriority.LOW}>Low</SelectItem>
                  <SelectItem value={TicketPriority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={TicketPriority.HIGH}>High</SelectItem>
                  <SelectItem value={TicketPriority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reservation">Related Reservation (Optional)</Label>
              <Select
                value={selectedReservationId?.toString()}
                onValueChange={(value) => setSelectedReservationId(value ? parseInt(value) : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a reservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {reservations?.content.map((reservation) => (
                    <SelectItem key={reservation.id} value={reservation.id.toString()}>
                      {reservation.service.name} - {format(new Date(reservation.serviceDate), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setSubject('');
                setDescription('');
                setPriority(TicketPriority.MEDIUM);
                setSelectedReservationId(undefined);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTicket} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

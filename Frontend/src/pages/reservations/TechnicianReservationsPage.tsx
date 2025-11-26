import { useEffect, useState } from 'react';
import { useApi } from '@/hooks';
import { ReservationService } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Phone, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { ReservationStatus } from '@/types';
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
import { Textarea } from '@/components/ui/textarea';

export const TechnicianReservationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'ALL'>('ALL');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { data: allReservations, loading, execute: fetchReservations } = useApi(
    () => ReservationService.getMyAsTechnician(0, 200)
  );

  useEffect(() => {
    fetchReservations();
  }, []);

  // Filtrar solo las reservaciones del técnico
  const myReservations = allReservations?.content || [];

  const filteredReservations = myReservations.filter(reservation => {
    const matchesSearch = 
      reservation.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleConfirm = async (reservationId: number) => {
    try {
      await ReservationService.confirm(reservationId);
      toast.success('Reservation confirmed successfully');
      fetchReservations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to confirm reservation');
    }
  };

  const handleReject = async (reservationId: number) => {
    try {
      await ReservationService.reject(reservationId);
      toast.success('Reservation rejected');
      fetchReservations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to reject reservation');
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;
    
    try {
      await ReservationService.cancel(selectedReservation.id, cancelReason);
      toast.success('Reservation cancelled');
      setIsCancelDialogOpen(false);
      setSelectedReservation(null);
      setCancelReason('');
      fetchReservations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case ReservationStatus.CONFIRMED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case ReservationStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case ReservationStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case ReservationStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case ReservationStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Status' },
    { value: ReservationStatus.PENDING, label: 'Pending' },
    { value: ReservationStatus.CONFIRMED, label: 'Confirmed' },
    { value: ReservationStatus.IN_PROGRESS, label: 'In Progress' },
    { value: ReservationStatus.COMPLETED, label: 'Completed' },
    { value: ReservationStatus.CANCELLED, label: 'Cancelled' },
    { value: ReservationStatus.REJECTED, label: 'Rejected' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Job Requests</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your service requests and appointments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myReservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myReservations.filter(r => r.status === ReservationStatus.PENDING).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myReservations.filter(r => 
                r.status === ReservationStatus.CONFIRMED || 
                r.status === ReservationStatus.IN_PROGRESS
              ).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myReservations.filter(r => r.status === ReservationStatus.COMPLETED).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client, service, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={statusFilter === status.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status.value as ReservationStatus | 'ALL')}
                  className="whitespace-nowrap"
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria'
                  : 'You don\'t have any job requests yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <Card key={reservation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{reservation.service.name}</h3>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <span className="font-medium">Client:</span>
                        {reservation.user.firstName} {reservation.user.lastName}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {reservation.user.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      S/ {(reservation.finalPrice ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reservation.serviceDate), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{reservation.startTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{reservation.address}</p>
                    </div>
                  </div>
                </div>

                {reservation.notes && (
                  <div className="mb-4 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium mb-1">Client Notes:</p>
                    <p className="text-sm text-muted-foreground">{reservation.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                {reservation.status === ReservationStatus.PENDING && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleConfirm(reservation.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Job
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(reservation.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Decline
                      </Button>
                    </>
                  )}
                  {reservation.status === ReservationStatus.CONFIRMED && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Awaiting customer confirmation of completion
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this job request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setSelectedReservation(null);
                setCancelReason('');
              }}
            >
              Keep Job
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!cancelReason.trim()}
            >
              Cancel Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

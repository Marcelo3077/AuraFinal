import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi, usePagination, useTechnicianServiceRates } from '@/hooks';
import { PaymentService, ReservationService } from '@/api';
import { PaymentMethod, Reservation, ReservationStatus } from '@/types';
import { ReservationCard } from '@/components/features/ReservationCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

export const ReservationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | ReservationStatus>('all');
  
  const { page, size, updatePagination, goToPage } = usePagination(0, 10);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const paymentMethods = [
    { value: PaymentMethod.CASH, label: 'Cash' },
    { value: PaymentMethod.CREDIT_CARD, label: 'Credit Card' },
    { value: PaymentMethod.DEBIT_CARD, label: 'Debit Card' },
    { value: PaymentMethod.YAPE, label: 'Yape' },
    { value: PaymentMethod.PLIN, label: 'Plin' },
  ];
  
  const { data, loading, execute } = useApi(
    () => ReservationService.getMy(page, size)
  );

  const { execute: cancelReservation } = useApi(
    (id: number) => ReservationService.cancel(id)
  );

  const { execute: completeReservation } = useApi(
    (id: number) => ReservationService.complete(id)
  );

  const { execute: createPayment, loading: creatingPayment } = useApi(
    (payload: { reservationId: number; amount: number; paymentMethod: PaymentMethod }) =>
      PaymentService.create(payload)
  );
  
  useEffect(() => {
    execute();
  }, [page, size]);
  
  useEffect(() => {
    if (data) {
      updatePagination(data);
    }
  }, [data, updatePagination]);

  const reservationsList = useMemo(() => data?.content || [], [data]);
  const reservationPairs = useMemo(
    () => reservationsList.map((reservation) => ({
      technicianId: reservation.technician?.id,
      serviceId: reservation.service?.id,
    })),
    [reservationsList]
  );
  const { rates: reservationRates } = useTechnicianServiceRates(reservationPairs);

  const resolvePrice = (reservation: Reservation) => {
    const priceKey = `${reservation.technician?.id}-${reservation.service?.id}`;
    const linkRate = reservationRates[priceKey];
    const reservationTotal =
      reservation.finalPrice && reservation.finalPrice > 0
        ? reservation.finalPrice
        : reservation.technicianBaseRate;
    return reservationTotal ?? linkRate ?? reservation.service?.suggestedPrice ?? 0;
  };
  
  const handleCancel = async (reservationId: number) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await cancelReservation(reservationId);
        toast.success('Reservation cancelled successfully');
        execute();
      } catch (error) {
        toast.error('Failed to cancel reservation');
      }
    }
  };

  const handleComplete = async (reservationId: number) => {
    try {
      const updatedReservation = await completeReservation(reservationId);
      toast.success('Reservation marked as completed');
      execute();

      const targetReservation =
        (updatedReservation as Reservation) ||
        reservationsList.find((reservation) => reservation.id === reservationId) ||
        null;

      if (targetReservation) {
        setSelectedReservation(targetReservation);
        setPaymentAmount(resolvePrice(targetReservation));
        setPaymentDialogOpen(true);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to complete reservation';
      toast.error(message);
    }
  };

  const handleSubmitPayment = async () => {
    if (!selectedReservation) return;

    try {
      await createPayment({
        reservationId: selectedReservation.id,
        amount: paymentAmount,
        paymentMethod,
      });
      toast.success('Payment recorded successfully');
      execute();
      setPaymentDialogOpen(false);
      navigate('/reviews', { state: { reservationId: selectedReservation.id } });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to record payment';
      toast.error(message);
    }
  };
  
  const filteredReservations = data?.content.filter(reservation => {
    if (activeTab === 'all') return true;
    return reservation.status === activeTab;
  }) || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Reservations</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track your service bookings
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={ReservationStatus.PENDING}>Pending</TabsTrigger>
          <TabsTrigger value={ReservationStatus.CONFIRMED}>Confirmed</TabsTrigger>
          <TabsTrigger value={ReservationStatus.REJECTED}>Rejected</TabsTrigger>
          <TabsTrigger value={ReservationStatus.COMPLETED}>Completed</TabsTrigger>
          <TabsTrigger value={ReservationStatus.CANCELLED}>Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No reservations found"
              description="You haven't made any reservations yet"
              action={{
                label: 'Browse Services',
                onClick: () => navigate('/services')
              }}
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    displayPrice={resolvePrice(reservation)}
                    onViewDetails={(r) => navigate(`/reservations/${r.id}`)}
                    onCancel={(r) => handleCancel(r.id)}
                    onComplete={(r) => handleComplete(r.id)}
                  />
                ))}
              </div>
              
              {data && (
                <Pagination
                  currentPage={page}
                  totalPages={data.totalPages}
                  totalItems={data.totalElements}
                  itemsPerPage={size}
                  onPageChange={goToPage}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <Dialog
        open={paymentDialogOpen}
        onOpenChange={(open) => {
          setPaymentDialogOpen(open);
          if (!open) {
            setSelectedReservation(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete your payment</DialogTitle>
            <DialogDescription>
              Confirm the payment method for {selectedReservation?.service.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-semibold">S/ {paymentAmount.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Label>Select payment method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="space-y-2"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.value}
                    className="flex items-center space-x-3 rounded-md border p-3"
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Label htmlFor={method.value} className="cursor-pointer">
                      {method.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitPayment} disabled={creatingPayment}>
              {creatingPayment ? 'Processing...' : 'Pay now'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

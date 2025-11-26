import { Reservation, ReservationStatus } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';

interface ReservationCardProps {
  reservation: Reservation;
  onViewDetails: (reservation: Reservation) => void;
  onCancel?: (reservation: Reservation) => void;
  onComplete?: (reservation: Reservation) => void;
  showActions?: boolean;
}

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  REJECTED: 'destructive',
  IN_PROGRESS: 'default',
  COMPLETED: 'secondary',
  CANCELLED: 'destructive',
};

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onViewDetails,
  onCancel,
  onComplete,
  showActions = true,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{reservation.service.name}</CardTitle>
          <Badge variant={statusColors[reservation.status] as any}>
            {reservation.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>
            {reservation.technician.firstName} {reservation.technician.lastName}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{format(new Date(reservation.serviceDate), 'PPP')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{reservation.startTime}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="line-clamp-1">{reservation.address}</span>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-primary">
              S/ {(reservation.finalPrice ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails(reservation)}
          >
            View Details
          </Button>
          {reservation.status === ReservationStatus.PENDING && onCancel && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onCancel(reservation)}
            >
              Cancel
            </Button>
          )}
          {reservation.status === ReservationStatus.CONFIRMED && onComplete && (
            <Button
              className="flex-1"
              onClick={() => onComplete(reservation)}
            >
              Mark as Completed
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

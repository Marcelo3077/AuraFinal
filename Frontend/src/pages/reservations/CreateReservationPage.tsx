import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks';
import { ReservationService } from '@/api';
import { CreateReservationRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const CreateReservationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { technicianId, serviceId } = location.state || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { values, errors, handleChange, handleSubmit } = useForm<CreateReservationRequest>({
    initialValues: {
      technicianId: technicianId || 0,
      serviceId: serviceId || 0,
      serviceDate: '',
      startTime: '',
      address: '',
      notes: '',
    },
    onSubmit: async (data) => {
      setIsSubmitting(true);
      try {
        const reservation = await ReservationService.create(data);
        toast.success('Reservation created successfully!');
        navigate(`/reservations/${reservation.id}`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to create reservation');
      } finally {
        setIsSubmitting(false);
      }
    },
    validate: (values) => {
      const errors: any = {};
      if (!values.technicianId) errors.technicianId = 'Technician is required';
      if (!values.serviceId) errors.serviceId = 'Service is required';
      if (!values.serviceDate) errors.serviceDate = 'Date is required';
      if (!values.startTime) errors.startTime = 'Time is required';
      if (!values.address) errors.address = 'Address is required';
      return errors;
    },
  });
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Reservation</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date</Label>
              <Input
                id="serviceDate"
                name="serviceDate"
                type="date"
                value={values.serviceDate}
                onChange={handleChange}
                error={errors.serviceDate}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={values.startTime}
                onChange={handleChange}
                error={errors.startTime}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Service Address</Label>
              <Input
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Enter full address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                placeholder="Any special requirements or instructions"
                rows={4}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Reservation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

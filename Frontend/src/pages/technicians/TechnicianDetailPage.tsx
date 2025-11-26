import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { TechnicianService, ServiceService } from '@/api';
import { useApi, useAuth } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, CheckCircle, MapPin, Phone, Star, Wrench } from 'lucide-react';
import { Service } from '@/types';

export const TechnicianDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isUser } = useAuth();

  const initialServiceId = (location.state as { serviceId?: number } | undefined)?.serviceId;
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>(initialServiceId);

  const { data: technician, loading: loadingTechnician, execute: fetchTechnician } = useApi(() =>
    TechnicianService.getById(Number(id))
  );

  const { data: service, loading: loadingService, execute: fetchService } = useApi(() =>
    selectedServiceId ? ServiceService.getById(selectedServiceId) : Promise.resolve(undefined as unknown as Service)
  );

  useEffect(() => {
    if (id) {
      fetchTechnician();
    }
  }, [id]);

  useEffect(() => {
    if (selectedServiceId) {
      fetchService();
    }
  }, [selectedServiceId]);

  useEffect(() => {
    if (!selectedServiceId && technician?.services?.length) {
      setSelectedServiceId(technician.services[0].id);
    }
  }, [technician, selectedServiceId]);

  const handleBook = () => {
    if (!technician || !selectedServiceId) return;
    navigate('/reservations/create', {
      state: {
        technicianId: technician.id,
        serviceId: selectedServiceId,
      }
    });
  };

  const selectedService = useMemo(() => {
    if (!selectedServiceId) return undefined;
    return technician?.services?.find((s) => s.id === selectedServiceId) || service;
  }, [selectedServiceId, technician, service]);

  const formatPrice = (value: number | null | undefined) => Number(value ?? 0).toFixed(2);
  const formatRating = (value: number | null | undefined) => Number(value ?? 0).toFixed(1);

  if (loadingTechnician || loadingService) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!technician) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Technician not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const availableServices = technician.services || (selectedService ? [selectedService] : []);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {(technician.firstName?.[0] || '') + (technician.lastName?.[0] || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl">
                {technician.firstName} {technician.lastName}
              </CardTitle>
              {technician.isActive && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {technician.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{formatRating(technician.averageRating)}</span>
              <span>({technician.totalReviews ?? 0} reviews)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground">{technician.description || 'No description available.'}</p>
          </div>

          {availableServices.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Services Offered</h3>
              <div className="flex flex-wrap gap-2">
                {availableServices.map((svc) => (
                  <Badge
                    key={svc.id}
                    variant={svc.id === selectedServiceId ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setSelectedServiceId(svc.id)}
                  >
                    {svc.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedService && (
            <div className="grid gap-2 rounded-lg border p-4 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{selectedService.name}</span>
                </div>
                <Badge variant="outline">{selectedService.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedService.description}</p>
              <p className="text-lg font-bold">Starting at S/ {formatPrice(selectedService.suggestedPrice)}</p>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Servicing your area (confirm availability during booking)
          </div>
        </CardContent>
        <CardFooter>
          {isUser ? (
            <Button className="w-full" disabled={!selectedServiceId} onClick={handleBook}>
              Book this technician
            </Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>
              Login as customer to book
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};


import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks';
import { ServiceService, TechnicianService, TechnicianServiceLinkService } from '@/api';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TechnicianCard } from '@/components/features/TechnicianCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Wrench } from 'lucide-react';
import { PaginatedResponse, Technician } from '@/types';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: service, loading: loadingService, execute: fetchService } = useApi(
    () => ServiceService.getById(Number(id))
  );
  
  const { data: technicians, loading: loadingTechnicians, execute: fetchTechnicians } = useApi<
    PaginatedResponse<Technician>
  >(async () => {
    if (!id) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
        first: true,
        last: true
      };
    }

    const normalizeTechnician = (technician: Technician): Technician => ({
      ...technician,
      specialties: technician.specialties ?? [],
      description: technician.description ?? 'No description available.',
      averageRating: Number(technician.averageRating ?? 0),
      totalReviews: technician.totalReviews ?? 0,
    });

    try {
      const response = await TechnicianService.getByService(Number(id));
      const content = response.content?.map(normalizeTechnician) ?? [];
      if (content.length > 0) {
        return { ...response, content };
      }
    } catch (error) {
      console.warn('Failed to load technicians directly, falling back to service links', error);
    }

    const serviceLinks = await TechnicianServiceLinkService.getByService(Number(id));

    if (serviceLinks.length === 0) {
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
        first: true,
        last: true
      };
    }

    const techniciansFromLinks = await Promise.all(
      serviceLinks.map(async (link) => {
        try {
          const technician = await TechnicianService.getById(link.technicianId);
          return normalizeTechnician(technician);
        } catch (error) {
          console.error('Could not load technician from link', link, error);
          return null;
        }
      })
    );

    const content = techniciansFromLinks.filter(Boolean) as Technician[];

    return {
      content,
      totalElements: content.length,
      totalPages: 1,
      size: content.length,
      number: 0,
      first: true,
      last: true
    };
  });
  
  useEffect(() => {
    if (id) {
      fetchService();
      fetchTechnicians();
    }
  }, [id]);
  
  if (loadingService || loadingTechnicians) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Service not found</p>
        <Button onClick={() => navigate('/services')} className="mt-4">
          Back to Services
        </Button>
      </div>
    );
  }

  const formatPrice = (value: number | null | undefined) => Number(value ?? 0).toFixed(2);
  
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/services')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Services
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{service.name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {service.category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Starting at</p>
              <p className="text-3xl font-bold text-primary">
                S/ {formatPrice(service.suggestedPrice)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Available Technicians</h2>
        {technicians?.content && technicians.content.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technicians.content.map((technician) => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                onSelect={(tech) => navigate(`/technicians/${tech.id}`, {
                  state: { serviceId: service.id }
                })}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No technicians available for this service yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

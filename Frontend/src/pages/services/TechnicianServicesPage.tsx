import { useEffect, useMemo, useState } from 'react';
import { useAuth, useApi } from '@/hooks';
import { ServiceService, TechnicianServiceLinkService } from '@/api';
import { TechnicianServiceLink, Service } from '@/types';
import { SERVICE_CATALOG } from '@/data/serviceCatalog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

type CatalogService = Service & { isPlaceholder?: boolean };

export const TechnicianServicesPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [baseRate, setBaseRate] = useState('');

  const {
    data: services,
    loading: loadingServices,
    execute: fetchServices
  } = useApi(() => ServiceService.getAll(0, 100));

  const {
    data: technicianServices,
    loading: loadingTechnicianServices,
    execute: fetchTechnicianServices
  } = useApi(() => TechnicianServiceLinkService.getByTechnician(user?.id ?? 0));

  useEffect(() => {
    fetchServices();
    if (user?.id) {
      fetchTechnicianServices();
    }
  }, [user?.id]);

  const catalogServices: CatalogService[] = useMemo(() => {
    const backendServices = services?.content ?? [];
    const existingCategories = new Set(backendServices.map(service => service.category));

    const placeholders = SERVICE_CATALOG
      .filter((item) => !existingCategories.has(item.category))
      .map((item, index) => ({
        id: -(index + 1),
        name: item.name,
        description: item.description,
        category: item.category,
        suggestedPrice: item.suggestedPrice ?? 0,
        isActive: true,
        createdAt: '',
        isPlaceholder: true,
      }));

    return [...backendServices, ...placeholders];
  }, [services]);

  const availableServices = useMemo(() => {
    const assignedIds = new Set((technicianServices || []).map(ts => ts.serviceId));
    return catalogServices.filter(service => !assignedIds.has(service.id));
  }, [catalogServices, technicianServices]);

  const handleAssociate = async () => {
    if (!user?.id || !selectedServiceId || !baseRate) return;

    const selectedService = catalogServices.find(service => service.id === selectedServiceId);

    if (!selectedService) return;

    try {
      const parsedRate = Number(baseRate);
      const safeRate = Number.isNaN(parsedRate)
        ? (selectedService.suggestedPrice ?? 0)
        : parsedRate;

      let targetServiceId = selectedService.id;

      if (selectedService.isPlaceholder) {
        const createdService = await ServiceService.create({
          name: selectedService.name,
          description: selectedService.description,
          category: selectedService.category
        });
        targetServiceId = createdService.id;
        await fetchServices();
      }

      await TechnicianServiceLinkService.create({
        technicianId: user.id,
        serviceId: targetServiceId,
        baseRate: safeRate
      });
      toast.success('Servicio asociado correctamente');
      setSelectedServiceId(null);
      setBaseRate('');
      fetchTechnicianServices();
    } catch (error: any) {
      toast.error(error.message || 'No se pudo asociar el servicio');
    }
  };

  const handleUpdateRate = async (service: TechnicianServiceLink, newRate: string) => {
    if (!newRate) return;
    try {
      await TechnicianServiceLinkService.updateBaseRate(service.technicianId, service.serviceId, Number(newRate));
      toast.success('Tarifa actualizada');
      fetchTechnicianServices();
    } catch (error: any) {
      toast.error(error.message || 'No se pudo actualizar la tarifa');
    }
  };

  if (loadingServices || loadingTechnicianServices) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis servicios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(technicianServices && technicianServices.length > 0) ? (
            <div className="space-y-3">
              {technicianServices.map((ts) => (
                <div key={ts.serviceId} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-semibold">{ts.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      Base rate: S/ {ts.baseRate.toFixed(2)} • Reservas: {ts.totalReservations}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`rate-${ts.serviceId}`} className="text-xs">Nueva tarifa</Label>
                    <Input
                      id={`rate-${ts.serviceId}`}
                      className="w-28"
                      type="number"
                      min={0}
                      step="0.1"
                      defaultValue={ts.baseRate}
                      onBlur={(e) => handleUpdateRate(ts, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aún no has asociado servicios.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agregar servicio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Servicio</Label>
              <Select
                value={selectedServiceId ? String(selectedServiceId) : ''}
                onValueChange={(value) => setSelectedServiceId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {availableServices.map(service => (
                    <SelectItem
                      key={service.id}
                      value={String(service.id)}
                    >
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tarifa base</Label>
              <Input
                type="number"
                min={0}
                step="0.1"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                placeholder="Ej: 50"
              />
            </div>
          </div>

          <Button
            onClick={handleAssociate}
            disabled={!selectedServiceId || !baseRate}
          >
            Asociar servicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

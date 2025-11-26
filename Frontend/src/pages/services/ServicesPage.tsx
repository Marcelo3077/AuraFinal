import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks';
import { ServiceService } from '@/api';
import { SERVICE_CATALOG } from '@/data/serviceCatalog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wrench, Search } from 'lucide-react';
import { Service, ServiceCategory } from '@/types';
import { toast } from 'sonner';

type CatalogService = Service & { isPlaceholder?: boolean };

export const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');

  const { data: servicesResponse, loading, execute: fetchServices } = useApi(
    () => ServiceService.getAll(0, 100)
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const defaultCatalog: CatalogService[] = useMemo(() => (
    SERVICE_CATALOG.map((item, index) => ({
      id: -(index + 1),
      name: item.name,
      description: item.description,
      category: item.category,
      suggestedPrice: item.suggestedPrice ?? 0,
      isActive: true,
      createdAt: '',
      isPlaceholder: true,
    }))
  ), []);

  const services = servicesResponse?.content || [];

  const catalogServices: CatalogService[] = useMemo(() => {
    const byCategory = new Set(services.map(service => service.category));
    const placeholders = defaultCatalog.filter(service => !byCategory.has(service.category));
    return [...services, ...placeholders];
  }, [services, defaultCatalog]);

  const filteredServices = catalogServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatServicePrice = (suggestedPrice: number | null | undefined) => {
    return Number(suggestedPrice ?? 0).toFixed(2);
  };

  const handleOpenService = (service: CatalogService) => {
    if (service.isPlaceholder || service.id < 0) {
      toast.info('Este servicio estará disponible próximamente.');
      return;
    }

    navigate(`/services/${service.id}`);
  };

  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: ServiceCategory.PLUMBING, label: 'Plumbing' },
    { value: ServiceCategory.ELECTRICAL, label: 'Electrical' },
    { value: ServiceCategory.CARPENTRY, label: 'Carpentry' },
    { value: ServiceCategory.PAINTING, label: 'Painting' },
    { value: ServiceCategory.CLEANING, label: 'Cleaning' },
    { value: ServiceCategory.GARDENING, label: 'Gardening' },
    { value: ServiceCategory.HVAC, label: 'HVAC' },
    { value: ServiceCategory.APPLIANCE_REPAIR, label: 'Appliance Repair' },
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
        <h1 className="text-3xl font-bold">Available Services</h1>
        <p className="text-muted-foreground mt-2">
          Browse and book professional services
        </p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value as ServiceCategory | 'ALL')}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleOpenService(service)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-secondary">
                    {service.category.replace('_', ' ')}
                  </span>
                </div>
                <CardTitle className="mt-4">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Starting at</p>
                    <p className="text-2xl font-bold">S/ {formatServicePrice(service.suggestedPrice)}</p>
                  </div>
                  <Button size="sm" disabled={service.isPlaceholder || service.id < 0}>
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredServices.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredServices.length} of {catalogServices.length} services
        </div>
      )}
    </div>
  );
};

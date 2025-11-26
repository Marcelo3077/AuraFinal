import { Service } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wrench } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {service.category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="text-2xl font-bold text-primary">
              S/ {Number(service.suggestedPrice ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(service)}>
          Book Service
        </Button>
      </CardFooter>
    </Card>
  );
};

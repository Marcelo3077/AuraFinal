import { Technician } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Star, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TechnicianCardProps {
  technician: Technician;
  onSelect: (technician: Technician) => void;
}

export const TechnicianCard: React.FC<TechnicianCardProps> = ({
  technician,
  onSelect
}) => {
  const specialties = technician.specialties ?? [];

  const getInitials = () => {
    const first = technician.firstName?.[0] || '';
    const last = technician.lastName?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'T';
  };

  const formatRating = (rating: number | null | undefined) => Number(rating ?? 0).toFixed(1);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {technician.firstName} {technician.lastName}
              </h3>
              {technician.isActive && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{formatRating(technician.averageRating)}</span>
              <span className="text-sm text-muted-foreground">
                ({technician.totalReviews ?? 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {technician.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
            </Badge>
          ))}
          {specialties.length > 3 && (
            <Badge variant="outline">
              +{specialties.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(technician)}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

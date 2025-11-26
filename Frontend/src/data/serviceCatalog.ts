import { ServiceCategory } from '@/types';

export interface ServiceCatalogItem {
  name: string;
  description: string;
  category: ServiceCategory;
  suggestedPrice?: number;
}

export const SERVICE_CATALOG: ServiceCatalogItem[] = [
  {
    name: 'Plumbing',
    description: 'Professional plumbing services for repairs and installations',
    category: ServiceCategory.PLUMBING,
    suggestedPrice: 0,
  },
  {
    name: 'Electrical',
    description: 'Certified electricians for safe installations and repairs',
    category: ServiceCategory.ELECTRICAL,
    suggestedPrice: 0,
  },
  {
    name: 'Carpentry',
    description: 'Custom carpentry, furniture repair, and wood installations',
    category: ServiceCategory.CARPENTRY,
    suggestedPrice: 0,
  },
  {
    name: 'Painting',
    description: 'Interior and exterior painting with professional finishes',
    category: ServiceCategory.PAINTING,
    suggestedPrice: 0,
  },
  {
    name: 'Cleaning',
    description: 'Residential and commercial cleaning services',
    category: ServiceCategory.CLEANING,
    suggestedPrice: 0,
  },
  {
    name: 'Gardening',
    description: 'Garden maintenance, landscaping, and plant care',
    category: ServiceCategory.GARDENING,
    suggestedPrice: 0,
  },
  {
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services',
    category: ServiceCategory.HVAC,
    suggestedPrice: 0,
  },
  {
    name: 'Appliance Repair',
    description: 'Repair and maintenance for household appliances',
    category: ServiceCategory.APPLIANCE_REPAIR,
    suggestedPrice: 0,
  },
];

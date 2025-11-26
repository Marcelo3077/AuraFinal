import { useEffect, useMemo, useState } from 'react';
import { TechnicianServiceLinkService } from '@/api';

export const useServiceBaseRates = (serviceIds: number[]) => {
  const uniqueIds = useMemo(
    () => Array.from(new Set(serviceIds.filter((id) => typeof id === 'number'))),
    [serviceIds]
  );

  const [rates, setRates] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      if (uniqueIds.length === 0) {
        setRates({});
        return;
      }

      setLoading(true);
      try {
        const entries = await Promise.all(
          uniqueIds.map(async (serviceId) => {
            try {
              const links = await TechnicianServiceLinkService.getByService(serviceId);
              if (!links.length) return null;

              const minRate = Math.min(...links.map((link) => link.baseRate));
              return [serviceId, minRate] as const;
            } catch (error) {
              console.warn('Unable to fetch service rates', { serviceId, error });
              return null;
            }
          })
        );

        const nextRates: Record<number, number> = {};
        entries.forEach((entry) => {
          if (entry) {
            const [serviceId, rate] = entry;
            nextRates[serviceId] = rate;
          }
        });

        setRates(nextRates);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [uniqueIds]);

  return { rates, loading };
};

export const useTechnicianServiceRates = (
  pairs: { technicianId?: number; serviceId?: number }[]
) => {
  const uniquePairs = useMemo(() => {
    const keys = pairs
      .filter((pair) => pair.technicianId && pair.serviceId)
      .map((pair) => `${pair.technicianId}-${pair.serviceId}`);

    return Array.from(new Set(keys));
  }, [pairs]);

  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      if (uniquePairs.length === 0) {
        setRates({});
        return;
      }

      setLoading(true);
      try {
        const entries = await Promise.all(
          uniquePairs.map(async (key) => {
            const [technicianId, serviceId] = key.split('-').map(Number);
            if (!technicianId || !serviceId) return null;

            try {
              const link = await TechnicianServiceLinkService.getById(technicianId, serviceId);
              return [key, link.baseRate] as const;
            } catch (error) {
              console.warn('Unable to fetch technician service rate', { technicianId, serviceId, error });
              return null;
            }
          })
        );

        const nextRates: Record<string, number> = {};
        entries.forEach((entry) => {
          if (entry) {
            const [key, rate] = entry;
            nextRates[key] = rate;
          }
        });

        setRates(nextRates);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [uniquePairs]);

  return { rates, loading };
};

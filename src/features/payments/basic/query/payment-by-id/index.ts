import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../../service';

export const usePaymentById = (id: string) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};
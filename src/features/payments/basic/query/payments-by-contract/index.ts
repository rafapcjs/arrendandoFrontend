import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../../service';

export const usePaymentsByContract = (contratoId: string) => {
  return useQuery({
    queryKey: ['payments', 'contract', contratoId],
    queryFn: () => paymentService.getPaymentsByContract(contratoId),
    enabled: !!contratoId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
};
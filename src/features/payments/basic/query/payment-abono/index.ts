import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { paymentService } from '../../service';
import type { PaymentAbonoDto } from '../../types/PaymentModel';

export const usePaymentAbono = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PaymentAbonoDto }) => 
      paymentService.addPaymentAbono(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Abono registrado exitosamente');
    },
    onError: (error: unknown) => {
      const message = error && typeof error === 'object' && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al registrar el abono'
        : 'Error al registrar el abono';
      toast.error(message);
    }
  });
};
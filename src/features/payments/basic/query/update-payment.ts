import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { paymentService } from '../service';
import type { UpdatePaymentDto } from '../types/PaymentModel';

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => 
      paymentService.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Pago actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Update payment error:', error);
      toast.error('Error al actualizar el pago');
    },
  });
};
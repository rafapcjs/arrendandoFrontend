import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { paymentService } from '../../service';
import type { UpdatePaymentDto } from '../../types/PaymentModel';

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentDto }) => 
      paymentService.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] });
      toast.success('Pago actualizado exitosamente');
    },
    onError: (error: any) => {
      console.error('Update payment mutation error:', error);
      
      let message = 'Error al actualizar el pago';
      
      if (error?.response?.data) {
        const errorData = error.response.data;
        console.error('Error details:', errorData);
        
        // Handle different error formats
        if (typeof errorData === 'string') {
          message = errorData;
        } else if (errorData.message) {
          message = errorData.message;
        } else if (errorData.error) {
          message = errorData.error;
        } else if (Array.isArray(errorData.errors)) {
          message = errorData.errors.join(', ');
        }
      } else if (error?.message) {
        message = error.message;
      }
      
      toast.error(message);
    }
  });
};
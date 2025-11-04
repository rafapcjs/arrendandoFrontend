import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { paymentService } from '../../service';
import type { UpdatePaymentDto } from '../../types/PaymentModel';

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: string[];
    } | string;
  };
  message?: string;
}

const isErrorWithResponse = (error: unknown): error is ErrorResponse => {
  return typeof error === 'object' && error !== null && 'response' in error;
}

const isErrorWithMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error;
}

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
    onError: (error: unknown) => {
      console.error('Update payment mutation error:', error);
      
      let message = 'Error al actualizar el pago';
      
      if (isErrorWithResponse(error) && error.response?.data) {
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
      } else if (isErrorWithMessage(error)) {
        message = error.message;
      }
      
      toast.error(message);
    }
  });
};
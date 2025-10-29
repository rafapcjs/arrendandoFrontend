import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { changePassword } from '../../service';
import type { ChangePasswordDto } from '../../types/AuthenticactionModel';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (changePasswordData: ChangePasswordDto) => changePassword(changePasswordData),
    onSuccess: () => {
      toast.success('✅ Contraseña cambiada exitosamente', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onError: (error: unknown) => {
      console.error('Change password error:', error);
      
      // Helper function to safely check if object has response property
      const isAxiosError = (err: unknown): err is { response: { status: number; data: { message?: string } }; message?: string } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };
      
      const hasMessage = (err: unknown): err is { message: string } => {
        return typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message: unknown }).message === 'string';
      };
      
      // Extraer mensaje de error más específico
      let errorMessage = 'No se pudo cambiar la contraseña';
      
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (isAxiosError(error) && error.response?.status === 401) {
        errorMessage = 'Contraseña actual incorrecta';
      } else if (isAxiosError(error) && error.response?.status === 400) {
        errorMessage = 'Datos de contraseña inválidos';
      } else if (isAxiosError(error) && error.response?.status === 403) {
        errorMessage = 'No tienes permisos para cambiar la contraseña';
      } else if (isAxiosError(error) && error.response?.status >= 500) {
        errorMessage = 'Error del servidor. Intenta nuevamente más tarde';
      } else if (hasMessage(error) && error.message === 'Network Error') {
        errorMessage = 'Error de conexión. Verifica tu internet';
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });
};
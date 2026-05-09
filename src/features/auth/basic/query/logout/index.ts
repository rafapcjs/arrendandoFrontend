import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logout } from '../../service';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearSession = () => {
    sessionStorage.clear();
    localStorage.clear();
    queryClient.clear();
  };

  return useMutation({
    mutationFn: () => Logout(),
    onSuccess: () => {
      clearSession();
      toast.success("Sesión cerrada exitosamente");
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      clearSession();
      toast.error("Error al cerrar sesión");
      navigate('/');
    },
  });
};
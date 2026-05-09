import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logout } from '../../service';

export const useLogout = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: () => Logout(),
    onSuccess: () => {
      sessionStorage.clear();
      localStorage.clear();
      toast.success("Sesión cerrada exitosamente");
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      sessionStorage.clear();
      localStorage.clear();
      toast.error("Error al cerrar sesión");
      navigate('/');
    },
  });
};
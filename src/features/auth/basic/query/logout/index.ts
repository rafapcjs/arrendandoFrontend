import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logout } from '../../service';

export const useLogout = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: () => Logout(),
    onSuccess: () => {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user_role');
      toast.success("Sesión cerrada exitosamente");
      navigate('/');
    },
    onError: (error) => {
      console.error('Logout error:', error);
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('user_role');
      toast.error("Error al cerrar sesión");
      navigate('/');
    },
  });
};
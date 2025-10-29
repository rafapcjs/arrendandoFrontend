
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../../service';
import type { LoginDto } from '../../types/AuthenticactionModel';

export const useLogin = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (loginData: LoginDto) => Login(loginData),
    onSuccess: (data) => {
      if (data?.access_token && data?.user) {
        sessionStorage.setItem('access_token', data.access_token);
        sessionStorage.setItem('user_role', data.user.role);
        toast.success("Inicio de sesión exitoso");
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      toast.error("Error al iniciar sesión");
    },
  });
};

 
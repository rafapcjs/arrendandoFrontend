import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Signup } from "../../service";
import type { CreateAdminDto } from "../../types/AuthenticactionModel";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registerData: CreateAdminDto) => Signup(registerData),

    onSuccess: (data) => {
      console.log("Registro exitoso:", data);
      toast.success("Usuario registrado exitosamente");

      // Refresca los datos relacionados con los usuarios administradores
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },

    onError: (error) => {
      console.error("Error en el registro:", error);
      toast.error("Error al registrar usuario");
    },
  });
};

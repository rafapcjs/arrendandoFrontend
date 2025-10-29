import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RecoverPassword } from "../../service";
import type { RecoverPass } from "../../types/AuthenticactionModel";
export const useRecoverPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recover: RecoverPass) => RecoverPassword(recover),

    onSuccess: (data) => {
      console.log("Recuperación exitosa:", data);
      toast.success("Solicitud de recuperación enviada exitosamente");

      // Refresca los datos relacionados con los usuarios administradores
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },

    onError: (error) => {
      console.error("Error en la recuperación:", error);
      toast.error("Error al enviar solicitud de recuperación");
    },
  });
};

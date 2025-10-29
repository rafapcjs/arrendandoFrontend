import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Code */}
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Página no encontrada
        </h2>
        
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página o el recurso no existe.
        </p>
        
        {/* Action Button */}
        <Button 
          onClick={handleGoHome}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Volver al Dashboard
        </Button>
        
        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-6">
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>
      </div>
    </div>
  );
};
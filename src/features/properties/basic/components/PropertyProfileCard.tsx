import { useProperty } from '../query/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';

interface PropertyProfileCardProps {
    propertyId: string;
}

export const PropertyProfileCard = ({ propertyId }: PropertyProfileCardProps) => {
    const { data: property, isLoading, error } = useProperty(propertyId);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Perfil del Inmueble</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Cargando...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Perfil del Inmueble</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">Error al cargar el perfil</p>
                </CardContent>
            </Card>
        );
    }

    if (!property) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-purple-800">Perfil del Inmueble</CardTitle>
                <CardDescription>Información detallada de la propiedad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <span className="font-semibold text-purple-700">Dirección:</span> {property.direccion}
                </div>
                <div>
                    <span className="font-semibold text-purple-700">Código Agua:</span> {property.codigoServicioAgua}
                </div>
                <div>
                    <span className="font-semibold text-purple-700">Código Gas:</span> {property.codigoServicioGas}
                </div>
                <div>
                    <span className="font-semibold text-purple-700">Código Luz:</span> {property.codigoServicioLuz}
                </div>
                {property.descripcion && (
                    <div>
                        <span className="font-semibold text-purple-700">Descripción:</span> {property.descripcion}
                    </div>
                )}
                <div>
                    <span className="font-semibold text-purple-700">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        property.disponible 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {property.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
                <div className="text-sm text-gray-500 pt-2 border-t">
                    <p>Creado: {new Date(property.createdAt).toLocaleDateString()}</p>
                    <p>Actualizado: {new Date(property.updatedAt).toLocaleDateString()}</p>
                </div>
            </CardContent>
        </Card>
    );
};
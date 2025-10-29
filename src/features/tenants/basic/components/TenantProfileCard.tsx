import { useTenant } from '../query/tenant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';

interface TenantProfileCardProps {
    tenantId: string;
}

export const TenantProfileCard = ({ tenantId }: TenantProfileCardProps) => {
    const { data: tenant, isLoading, error } = useTenant(tenantId);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Perfil del Inquilino</CardTitle>
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
                    <CardTitle className="text-green-800">Perfil del Inquilino</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600">Error al cargar el perfil</p>
                </CardContent>
            </Card>
        );
    }

    if (!tenant) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-green-800">Perfil del Inquilino</CardTitle>
                <CardDescription>Información detallada del inquilino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div>
                    <span className="font-semibold text-green-700">Nombre:</span> {tenant.nombres} {tenant.apellidos}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Cédula:</span> {tenant.cedula}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Email:</span> {tenant.correo}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Teléfono:</span> {tenant.telefono}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Dirección:</span> {tenant.direccion}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Ciudad:</span> {tenant.ciudad}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Contacto de Emergencia:</span> {tenant.contactoEmergencia}
                </div>
                <div>
                    <span className="font-semibold text-green-700">Estado:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        tenant.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {tenant.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </div>
                <div className="text-sm text-gray-500 pt-2 border-t">
                    <p>Creado: {new Date(tenant.createdAt).toLocaleDateString()}</p>
                    <p>Actualizado: {new Date(tenant.updatedAt).toLocaleDateString()}</p>
                </div>
            </CardContent>
        </Card>
    );
};
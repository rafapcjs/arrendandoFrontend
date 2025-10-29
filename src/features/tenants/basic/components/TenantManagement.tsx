import { useState } from 'react';
import { useTenants, useSearchTenants } from '../query/tenants';
import { useUpdateTenant, useActivateTenant, useDeleteTenant, useCreateTenant } from '../query/tenant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';
import { checkTenantHasActiveContract } from '../../../contracts/basic/service';
import { toast } from 'react-toastify';
import type { Tenant, UpdateTenantDto, CreateTenantDto, TenantSearchParams } from '../types/TenantModel';

export const TenantManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdateTenantDto>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreateTenantDto>({
        cedula: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        correo: '',
        direccion: '',
        ciudad: '',
        contactoEmergencia: '',
        isActive: true
    });
    const [searchParams, setSearchParams] = useState<TenantSearchParams>({
        page,
        limit
    });
    const [showSearch, setShowSearch] = useState(false);

    // Use regular tenants query by default, search query when searching
    const { data: tenantsData, isLoading, error } = useTenants(
        showSearch ? undefined : page, 
        showSearch ? undefined : limit
    );
    const { data: searchData, isLoading: searchLoading } = useSearchTenants(searchParams);
    
    // Use search data if searching, otherwise regular data
    const currentData = showSearch ? searchData : tenantsData;
    const currentLoading = showSearch ? searchLoading : isLoading;

    const updateTenantMutation = useUpdateTenant();
    const activateTenantMutation = useActivateTenant();
    const deleteTenantMutation = useDeleteTenant();
    const createTenantMutation = useCreateTenant();

    const handleEdit = (tenant: Tenant) => {
        setEditingTenant(tenant);
        setEditForm({
            cedula: tenant.cedula,
            nombres: tenant.nombres,
            apellidos: tenant.apellidos,
            telefono: tenant.telefono,
            correo: tenant.correo,
            direccion: tenant.direccion,
            ciudad: tenant.ciudad,
            contactoEmergencia: tenant.contactoEmergencia,
            isActive: tenant.isActive,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingTenant) return;
        
        try {
            await updateTenantMutation.mutateAsync({
                id: editingTenant.id,
                data: editForm,
            });
            setShowEditModal(false);
            setEditingTenant(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating tenant:', error);
        }
    };

    const handleActivate = async (tenantId: string, isActive: boolean) => {
        try {
            // Si se está intentando desactivar, verificar si tiene contratos activos
            if (!isActive) {
                const hasActiveContract = await checkTenantHasActiveContract(tenantId);
                if (hasActiveContract) {
                    toast.error('No se puede desactivar este inquilino porque está asociado a un contrato activo');
                    return;
                }
            }
            
            await activateTenantMutation.mutateAsync({
                id: tenantId,
                data: { isActive },
            });
            
            toast.success(`Inquilino ${isActive ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error updating tenant status:', error);
            toast.error('Error al cambiar el estado del inquilino');
        }
    };

    const handleDelete = async (tenantId: string) => {
        confirmDialog({
            title: '¿Eliminar inquilino?',
            message: '¿Estás seguro de que quieres eliminar este inquilino? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteTenantMutation.mutateAsync(tenantId);
                } catch (error) {
                    console.error('Error deleting tenant:', error);
                }
            }
        });
    };

    const handleCreate = async () => {
        try {
            await createTenantMutation.mutateAsync(createForm);
            setShowCreateModal(false);
            setCreateForm({
                cedula: '',
                nombres: '',
                apellidos: '',
                telefono: '',
                correo: '',
                direccion: '',
                ciudad: '',
                contactoEmergencia: '',
                isActive: true
            });
        } catch (error) {
            console.error('Error creating tenant:', error);
        }
    };

    const handleSearch = () => {
        setShowSearch(true);
        setSearchParams({
            ...searchParams,
            page: 1
        });
    };

    const clearSearch = () => {
        setShowSearch(false);
        setSearchParams({
            page: 1,
            limit: 10
        });
        setPage(1);
    };

    if (currentLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Gestión de Inquilinos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando inquilinos...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Gestión de Inquilinos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar inquilinos</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-green-800">Gestión de Inquilinos</CardTitle>
                            <CardDescription>
                                Administra todos los inquilinos del sistema - Total: {currentData?.total || 0} inquilinos
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                + Registrar Inquilino
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search Section */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3">Buscar Inquilinos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <Input
                                placeholder="Buscar por nombre, apellido o cédula"
                                value={searchParams.search || ''}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                                className="md:col-span-2"
                            />
                            <Input
                                placeholder="Ciudad"
                                value={searchParams.ciudad || ''}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, ciudad: e.target.value }))}
                            />
                            <select
                                value={searchParams.isActive?.toString() || ''}
                                onChange={(e) => setSearchParams(prev => ({ 
                                    ...prev, 
                                    isActive: e.target.value === '' ? undefined : e.target.value === 'true' 
                                }))}
                                className="px-3 py-2 border border-input rounded-md"
                            >
                                <option value="">Todos los estados</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button onClick={handleSearch} size="sm" className="bg-green-600 hover:bg-green-700">
                                Buscar
                            </Button>
                            {showSearch && (
                                <Button onClick={clearSearch} size="sm" variant="outline">
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {currentData?.data.map((tenant) => (
                            <div key={tenant.id} className="border rounded-lg p-4 hover:bg-green-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-green-800">
                                                {tenant.nombres} {tenant.apellidos}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                tenant.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {tenant.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-gray-600"><span className="font-medium">Cédula:</span> {tenant.cedula}</p>
                                            <p className="text-gray-600"><span className="font-medium">Email:</span> {tenant.correo}</p>
                                            <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {tenant.telefono}</p>
                                            <p className="text-gray-600"><span className="font-medium">Ciudad:</span> {tenant.ciudad}</p>
                                        </div>
                                        <p className="text-gray-600 text-sm"><span className="font-medium">Dirección:</span> {tenant.direccion}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>
                                                Creado: {new Date(tenant.createdAt).toLocaleDateString()}
                                            </span>
                                            <span>
                                                Actualizado: {new Date(tenant.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(tenant)}
                                            disabled={updateTenantMutation.isPending}
                                            className="border-green-300 text-green-700 hover:bg-green-50"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={tenant.isActive ? "destructive" : "default"}
                                            onClick={() => handleActivate(tenant.id, !tenant.isActive)}
                                            disabled={activateTenantMutation.isPending}
                                            className={tenant.isActive ? '' : 'bg-green-600 hover:bg-green-700'}
                                        >
                                            {tenant.isActive ? 'Desactivar' : 'Activar'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(tenant.id)}
                                            disabled={deleteTenantMutation.isPending}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {currentData?.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {showSearch ? 'No se encontraron inquilinos con los criterios de búsqueda' : 'No hay inquilinos para mostrar'}
                            </div>
                        )}
                    </div>

                    {/* Enhanced Pagination */}
                    {currentData && currentData.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (showSearch) {
                                            setSearchParams(prev => ({ ...prev, page: 1 }));
                                        } else {
                                            setPage(1);
                                        }
                                    }}
                                    disabled={(showSearch ? searchParams.page : page) === 1}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Primera
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (showSearch) {
                                            setSearchParams(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
                                        } else {
                                            setPage(p => Math.max(1, p - 1));
                                        }
                                    }}
                                    disabled={(showSearch ? searchParams.page : page) === 1}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Anterior
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    Página {showSearch ? searchParams.page : page} de {currentData.totalPages}
                                </span>
                                <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
                                    {currentData.total} inquilinos total
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (showSearch) {
                                            setSearchParams(prev => ({ ...prev, page: Math.min(currentData.totalPages, (prev.page || 1) + 1) }));
                                        } else {
                                            setPage(p => Math.min(currentData.totalPages, p + 1));
                                        }
                                    }}
                                    disabled={(showSearch ? searchParams.page : page) === currentData.totalPages}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Siguiente
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        if (showSearch) {
                                            setSearchParams(prev => ({ ...prev, page: currentData.totalPages }));
                                        } else {
                                            setPage(currentData.totalPages);
                                        }
                                    }}
                                    disabled={(showSearch ? searchParams.page : page) === currentData.totalPages}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Última
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Tenant Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Registrar Nuevo Inquilino</DialogTitle>
                        <DialogDescription>
                            Crea un nuevo registro de inquilino en el sistema
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createCedula">Cédula *</Label>
                                <Input
                                    id="createCedula"
                                    value={createForm.cedula}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, cedula: e.target.value }))}
                                    placeholder="Número de cédula"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createTelefono">Teléfono *</Label>
                                <Input
                                    id="createTelefono"
                                    value={createForm.telefono}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, telefono: e.target.value }))}
                                    placeholder="Número de teléfono"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createNombres">Nombres *</Label>
                                <Input
                                    id="createNombres"
                                    value={createForm.nombres}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, nombres: e.target.value }))}
                                    placeholder="Nombres"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createApellidos">Apellidos *</Label>
                                <Input
                                    id="createApellidos"
                                    value={createForm.apellidos}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, apellidos: e.target.value }))}
                                    placeholder="Apellidos"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="createCorreo">Email *</Label>
                            <Input
                                id="createCorreo"
                                type="email"
                                value={createForm.correo}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, correo: e.target.value }))}
                                placeholder="inquilino@ejemplo.com"
                                required
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="createDireccion">Dirección *</Label>
                            <Input
                                id="createDireccion"
                                value={createForm.direccion}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Dirección completa"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createCiudad">Ciudad *</Label>
                                <Input
                                    id="createCiudad"
                                    value={createForm.ciudad}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, ciudad: e.target.value }))}
                                    placeholder="Ciudad"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createContactoEmergencia">Contacto de Emergencia *</Label>
                                <Input
                                    id="createContactoEmergencia"
                                    value={createForm.contactoEmergencia}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, contactoEmergencia: e.target.value }))}
                                    placeholder="Contacto de emergencia"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Label className="text-green-800 font-medium">Estado</Label>
                            <p className="text-sm text-green-600 mt-1">Activo (El inquilino estará activo por defecto)</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({
                                    cedula: '',
                                    nombres: '',
                                    apellidos: '',
                                    telefono: '',
                                    correo: '',
                                    direccion: '',
                                    ciudad: '',
                                    contactoEmergencia: '',
                                    isActive: true
                                });
                            }}
                            disabled={createTenantMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleCreate}
                            disabled={createTenantMutation.isPending || !createForm.cedula || !createForm.nombres || !createForm.apellidos || !createForm.telefono || !createForm.correo || !createForm.direccion || !createForm.ciudad || !createForm.contactoEmergencia}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {createTenantMutation.isPending ? 'Registrando...' : 'Registrar Inquilino'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Tenant Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Editar Inquilino</DialogTitle>
                        <DialogDescription>
                            Editando: {editingTenant?.nombres} {editingTenant?.apellidos}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editCedula">Cédula</Label>
                                <Input
                                    id="editCedula"
                                    value={editForm.cedula || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, cedula: e.target.value }))}
                                    placeholder="Número de cédula"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editTelefono">Teléfono</Label>
                                <Input
                                    id="editTelefono"
                                    value={editForm.telefono || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, telefono: e.target.value }))}
                                    placeholder="Número de teléfono"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editNombres">Nombres</Label>
                                <Input
                                    id="editNombres"
                                    value={editForm.nombres || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, nombres: e.target.value }))}
                                    placeholder="Nombres"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editApellidos">Apellidos</Label>
                                <Input
                                    id="editApellidos"
                                    value={editForm.apellidos || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, apellidos: e.target.value }))}
                                    placeholder="Apellidos"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="editCorreo">Email</Label>
                            <Input
                                id="editCorreo"
                                type="email"
                                value={editForm.correo || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, correo: e.target.value }))}
                                placeholder="inquilino@ejemplo.com"
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="editDireccion">Dirección</Label>
                            <Input
                                id="editDireccion"
                                value={editForm.direccion || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Dirección completa"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editCiudad">Ciudad</Label>
                                <Input
                                    id="editCiudad"
                                    value={editForm.ciudad || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, ciudad: e.target.value }))}
                                    placeholder="Ciudad"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editContactoEmergencia">Contacto de Emergencia</Label>
                                <Input
                                    id="editContactoEmergencia"
                                    value={editForm.contactoEmergencia || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, contactoEmergencia: e.target.value }))}
                                    placeholder="Contacto de emergencia"
                                />
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-lg">
                            <Label className="text-green-800 font-medium">Inquilino Actual</Label>
                            <p className="text-sm text-green-600 mt-1">{editingTenant?.nombres} {editingTenant?.apellidos}</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingTenant(null);
                                setEditForm({});
                            }}
                            disabled={updateTenantMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleUpdate}
                            disabled={updateTenantMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {updateTenantMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
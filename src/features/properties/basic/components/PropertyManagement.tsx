import { useState } from 'react';
import { useProperties, useSearchProperties } from '../query/properties';
import { useUpdateProperty, useActivateProperty, useDeleteProperty, useCreateProperty } from '../query/property';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import type { Property, UpdatePropertyDto, CreatePropertyDto, PropertySearchParams } from '../types/PropertyModel';
import { checkPropertyHasActiveContract } from '../../../contracts/basic/service';
import { toast } from 'react-toastify';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';

export const PropertyManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdatePropertyDto>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreatePropertyDto>({
        direccion: '',
        codigoServicioAgua: '',
        codigoServicioGas: '',
        codigoServicioLuz: '',
        disponible: true,
        descripcion: ''
    });
    const [searchParams, setSearchParams] = useState<PropertySearchParams>({
        page,
        limit
    });
    const [showSearch, setShowSearch] = useState(false);

    // Use regular properties query by default, search query when searching
    const { data: propertiesData, isLoading, error } = useProperties(
        showSearch ? undefined : page, 
        showSearch ? undefined : limit
    );
    const { data: searchData, isLoading: searchLoading } = useSearchProperties(searchParams);
    
    // Use search data if searching, otherwise regular data
    const currentData = showSearch ? searchData : propertiesData;
    const currentLoading = showSearch ? searchLoading : isLoading;

    const updatePropertyMutation = useUpdateProperty();
    const activatePropertyMutation = useActivateProperty();
    const deletePropertyMutation = useDeleteProperty();
    const createPropertyMutation = useCreateProperty();

    const handleEdit = (property: Property) => {
        setEditingProperty(property);
        setEditForm({
            direccion: property.direccion,
            codigoServicioAgua: property.codigoServicioAgua,
            codigoServicioGas: property.codigoServicioGas,
            codigoServicioLuz: property.codigoServicioLuz,
            disponible: property.disponible,
            descripcion: property.descripcion,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingProperty) return;
        
        try {
            await updatePropertyMutation.mutateAsync({
                id: editingProperty.id,
                updateData: editForm,
            });
            setShowEditModal(false);
            setEditingProperty(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating property:', error);
        }
    };

    const handleActivate = async (propertyId: string, disponible: boolean) => {
        try {
            // Si está intentando desactivar (disponible = false), verificar si tiene contrato activo
            if (!disponible) {
                const hasActiveContract = await checkPropertyHasActiveContract(propertyId);
                if (hasActiveContract) {
                    toast.error('No se puede desactivar este inmueble porque está asociado a un contrato activo');
                    return;
                }
            }
            
            await activatePropertyMutation.mutateAsync({
                id: propertyId,
                activateData: { disponible },
            });
            
            // Mostrar mensaje de éxito
            toast.success(`Inmueble ${disponible ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error updating property availability:', error);
            toast.error('Error al cambiar la disponibilidad del inmueble');
        }
    };

    const handleDelete = async (propertyId: string) => {
        confirmDialog({
            title: '¿Eliminar inmueble?',
            message: '¿Estás seguro de que quieres eliminar este inmueble? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deletePropertyMutation.mutateAsync(propertyId);
                } catch (error) {
                    console.error('Error deleting property:', error);
                }
            }
        });
    };

    const handleCreate = async () => {
        try {
            await createPropertyMutation.mutateAsync(createForm);
            setShowCreateModal(false);
            setCreateForm({
                direccion: '',
                codigoServicioAgua: '',
                codigoServicioGas: '',
                codigoServicioLuz: '',
                disponible: true,
                descripcion: ''
            });
        } catch (error) {
            console.error('Error creating property:', error);
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
                    <CardTitle className="text-purple-800">Gestión de Inmuebles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando inmuebles...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Gestión de Inmuebles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar inmuebles</p>
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
                            <CardTitle className="text-purple-800">Gestión de Inmuebles</CardTitle>
                            <CardDescription>
                                Administra todas las propiedades del sistema - Total: {currentData?.total || 0} inmuebles
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                + Agregar Inmueble
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search Section */}
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-3">Buscar Inmuebles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Input
                                placeholder="Buscar por dirección, códigos o descripción"
                                value={searchParams.search || ''}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                                className="md:col-span-2"
                            />
                            <select
                                value={searchParams.disponible?.toString() || ''}
                                onChange={(e) => setSearchParams(prev => ({ 
                                    ...prev, 
                                    disponible: e.target.value === '' ? undefined : e.target.value === 'true' 
                                }))}
                                className="px-3 py-2 border border-input rounded-md"
                            >
                                <option value="">Todas las disponibilidades</option>
                                <option value="true">Disponibles</option>
                                <option value="false">No disponibles</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button onClick={handleSearch} size="sm" className="bg-purple-600 hover:bg-purple-700">
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
                        {currentData?.data.map((property) => (
                            <div key={property.id} className="border rounded-lg p-4 hover:bg-purple-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-purple-800">
                                                {property.direccion}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                property.disponible 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {property.disponible ? 'Disponible' : 'No disponible'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                            <p className="text-gray-600"><span className="font-medium">Agua:</span> {property.codigoServicioAgua}</p>
                                            <p className="text-gray-600"><span className="font-medium">Gas:</span> {property.codigoServicioGas}</p>
                                            <p className="text-gray-600"><span className="font-medium">Luz:</span> {property.codigoServicioLuz}</p>
                                        </div>
                                        {property.descripcion && (
                                            <p className="text-gray-600 text-sm"><span className="font-medium">Descripción:</span> {property.descripcion}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>
                                                Creado: {new Date(property.createdAt).toLocaleDateString()}
                                            </span>
                                            <span>
                                                Actualizado: {new Date(property.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(property)}
                                            disabled={updatePropertyMutation.isPending}
                                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={property.disponible ? "destructive" : "default"}
                                            onClick={() => handleActivate(property.id, !property.disponible)}
                                            disabled={activatePropertyMutation.isPending}
                                            className={property.disponible ? '' : 'bg-purple-600 hover:bg-purple-700'}
                                        >
                                            {property.disponible ? 'No disponible' : 'Disponible'}
                                        </Button>
                                        {property.disponible && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(property.id)}
                                                disabled={deletePropertyMutation.isPending}
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {currentData?.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {showSearch ? 'No se encontraron inmuebles con los criterios de búsqueda' : 'No hay inmuebles para mostrar'}
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
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
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
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                >
                                    Anterior
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    Página {showSearch ? searchParams.page : page} de {currentData.totalPages}
                                </span>
                                <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded">
                                    {currentData.total} inmuebles total
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
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
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
                                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                >
                                    Última
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Property Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Agregar Nuevo Inmueble</DialogTitle>
                        <DialogDescription>
                            Registra una nueva propiedad en el sistema
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div>
                            <Label htmlFor="createDireccion">Dirección *</Label>
                            <Input
                                id="createDireccion"
                                value={createForm.direccion}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Carrera 15 #85-32, Chapinero, Bogotá"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="createAgua">Código Servicio Agua *</Label>
                                <Input
                                    id="createAgua"
                                    value={createForm.codigoServicioAgua}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, codigoServicioAgua: e.target.value }))}
                                    placeholder="AG123456789"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createGas">Código Servicio Gas *</Label>
                                <Input
                                    id="createGas"
                                    value={createForm.codigoServicioGas}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, codigoServicioGas: e.target.value }))}
                                    placeholder="GS987654321"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createLuz">Código Servicio Luz *</Label>
                                <Input
                                    id="createLuz"
                                    value={createForm.codigoServicioLuz}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, codigoServicioLuz: e.target.value }))}
                                    placeholder="LZ456789123"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="createDescripcion">Descripción</Label>
                            <Input
                                id="createDescripcion"
                                value={createForm.descripcion}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, descripcion: e.target.value }))}
                                placeholder="Apartamento moderno con vista panorámica"
                            />
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Label className="text-purple-800 font-medium">Disponibilidad</Label>
                            <p className="text-sm text-purple-600 mt-1">Disponible (El inmueble estará disponible por defecto)</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({
                                    direccion: '',
                                    codigoServicioAgua: '',
                                    codigoServicioGas: '',
                                    codigoServicioLuz: '',
                                    disponible: true,
                                    descripcion: ''
                                });
                            }}
                            disabled={createPropertyMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleCreate}
                            disabled={createPropertyMutation.isPending || !createForm.direccion || !createForm.codigoServicioAgua || !createForm.codigoServicioGas || !createForm.codigoServicioLuz}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {createPropertyMutation.isPending ? 'Registrando...' : 'Registrar Inmueble'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Property Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Editar Inmueble</DialogTitle>
                        <DialogDescription>
                            Editando: {editingProperty?.direccion}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div>
                            <Label htmlFor="editDireccion">Dirección</Label>
                            <Input
                                id="editDireccion"
                                value={editForm.direccion || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Carrera 15 #85-32, Chapinero, Bogotá"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="editAgua">Código Servicio Agua</Label>
                                <Input
                                    id="editAgua"
                                    value={editForm.codigoServicioAgua || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, codigoServicioAgua: e.target.value }))}
                                    placeholder="AG123456789"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editGas">Código Servicio Gas</Label>
                                <Input
                                    id="editGas"
                                    value={editForm.codigoServicioGas || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, codigoServicioGas: e.target.value }))}
                                    placeholder="GS987654321"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editLuz">Código Servicio Luz</Label>
                                <Input
                                    id="editLuz"
                                    value={editForm.codigoServicioLuz || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, codigoServicioLuz: e.target.value }))}
                                    placeholder="LZ456789123"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="editDescripcion">Descripción</Label>
                            <Input
                                id="editDescripcion"
                                value={editForm.descripcion || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, descripcion: e.target.value }))}
                                placeholder="Apartamento moderno con vista panorámica"
                            />
                        </div>
                        
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Label className="text-purple-800 font-medium">Inmueble Actual</Label>
                            <p className="text-sm text-purple-600 mt-1">{editingProperty?.direccion}</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingProperty(null);
                                setEditForm({});
                            }}
                            disabled={updatePropertyMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleUpdate}
                            disabled={updatePropertyMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {updatePropertyMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
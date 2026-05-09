import { useState } from 'react';
import { useInmobiliarias } from '../query/inmobiliarias';
import { useCreateInmobiliaria, useUpdateInmobiliaria, useToggleEstadoInmobiliaria } from '../query/inmobiliaria';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import type { Inmobiliaria, CreateInmobiliariaDto, UpdateInmobiliariaDto } from '../types/InmobiliariaModel';

export const InmobiliariaManagement = () => {
    const [editingInmobiliaria, setEditingInmobiliaria] = useState<Inmobiliaria | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdateInmobiliariaDto>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreateInmobiliariaDto>({
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        estado: 'ACTIVA',
    });
    const [search, setSearch] = useState('');

    const { data: inmobiliarias, isLoading, error } = useInmobiliarias();
    const createInmobiliariaMutation = useCreateInmobiliaria();
    const updateInmobiliariaMutation = useUpdateInmobiliaria();
    const toggleEstadoMutation = useToggleEstadoInmobiliaria();

    const filtered = (inmobiliarias ?? []).filter((i) =>
        i.nombre.toLowerCase().includes(search.toLowerCase()) ||
        i.nit.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (inmobiliaria: Inmobiliaria) => {
        setEditingInmobiliaria(inmobiliaria);
        setEditForm({
            nombre: inmobiliaria.nombre,
            nit: inmobiliaria.nit,
            direccion: inmobiliaria.direccion,
            telefono: inmobiliaria.telefono,
            email: inmobiliaria.email,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingInmobiliaria) return;
        try {
            await updateInmobiliariaMutation.mutateAsync({ id: editingInmobiliaria.id, updateData: editForm });
            setShowEditModal(false);
            setEditingInmobiliaria(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating inmobiliaria:', error);
        }
    };

    const handleCreate = async () => {
        try {
            await createInmobiliariaMutation.mutateAsync(createForm);
            setShowCreateModal(false);
            setCreateForm({ nombre: '', nit: '', direccion: '', telefono: '', email: '', estado: 'ACTIVA' });
        } catch (error) {
            console.error('Error creating inmobiliaria:', error);
        }
    };

    const handleToggleEstado = async (id: string) => {
        try {
            await toggleEstadoMutation.mutateAsync(id);
        } catch (error) {
            console.error('Error toggling estado:', error);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Gestión de Inmobiliarias</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando inmobiliarias...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Gestión de Inmobiliarias</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar inmobiliarias</p>
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
                            <CardTitle className="text-purple-800">Gestión de Inmobiliarias</CardTitle>
                            <CardDescription>
                                Administra todas las inmobiliarias del sistema - Total: {inmobiliarias?.length ?? 0} inmobiliarias
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            + Agregar Inmobiliaria
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-3">Buscar Inmobiliarias</h3>
                        <Input
                            placeholder="Buscar por nombre, NIT o email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {filtered.map((inmobiliaria) => (
                            <div key={inmobiliaria.id} className="border rounded-lg p-4 hover:bg-purple-50 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-purple-800">
                                                {inmobiliaria.nombre}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                inmobiliaria.estado === 'ACTIVA'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {inmobiliaria.estado}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-gray-600"><span className="font-medium">NIT:</span> {inmobiliaria.nit}</p>
                                            <p className="text-gray-600"><span className="font-medium">Email:</span> {inmobiliaria.email}</p>
                                            <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {inmobiliaria.telefono}</p>
                                            <p className="text-gray-600"><span className="font-medium">Dirección:</span> {inmobiliaria.direccion}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Creado: {new Date(inmobiliaria.createdAt).toLocaleDateString()}</span>
                                            <span>Actualizado: {new Date(inmobiliaria.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(inmobiliaria)}
                                            disabled={updateInmobiliariaMutation.isPending}
                                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={inmobiliaria.estado === 'ACTIVA' ? 'destructive' : 'default'}
                                            onClick={() => handleToggleEstado(inmobiliaria.id)}
                                            disabled={toggleEstadoMutation.isPending}
                                            className={inmobiliaria.estado !== 'ACTIVA' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                        >
                                            {inmobiliaria.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {search ? 'No se encontraron inmobiliarias con ese criterio' : 'No hay inmobiliarias para mostrar'}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Agregar Nueva Inmobiliaria</DialogTitle>
                        <DialogDescription>Registra una nueva inmobiliaria en el sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div>
                            <Label htmlFor="createNombre">Nombre *</Label>
                            <Input
                                id="createNombre"
                                value={createForm.nombre}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, nombre: e.target.value }))}
                                placeholder="Inmobiliaria Ejemplo S.A.S."
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createNit">NIT *</Label>
                                <Input
                                    id="createNit"
                                    value={createForm.nit}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, nit: e.target.value }))}
                                    placeholder="900123456-7"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="createTelefono">Teléfono *</Label>
                                <Input
                                    id="createTelefono"
                                    value={createForm.telefono}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, telefono: e.target.value }))}
                                    placeholder="3001234567"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="createEmail">Email *</Label>
                            <Input
                                id="createEmail"
                                type="email"
                                value={createForm.email}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="contacto@inmobiliaria.com"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="createDireccion">Dirección *</Label>
                            <Input
                                id="createDireccion"
                                value={createForm.direccion}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Calle 10 # 20-30, Bogotá"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({ nombre: '', nit: '', direccion: '', telefono: '', email: '', estado: 'ACTIVA' });
                            }}
                            disabled={createInmobiliariaMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                createInmobiliariaMutation.isPending ||
                                !createForm.nombre ||
                                !createForm.nit ||
                                !createForm.direccion ||
                                !createForm.telefono ||
                                !createForm.email
                            }
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {createInmobiliariaMutation.isPending ? 'Registrando...' : 'Registrar Inmobiliaria'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Editar Inmobiliaria</DialogTitle>
                        <DialogDescription>Editando: {editingInmobiliaria?.nombre}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div>
                            <Label htmlFor="editNombre">Nombre</Label>
                            <Input
                                id="editNombre"
                                value={editForm.nombre || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                                placeholder="Inmobiliaria Ejemplo S.A.S."
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editNit">NIT</Label>
                                <Input
                                    id="editNit"
                                    value={editForm.nit || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, nit: e.target.value }))}
                                    placeholder="900123456-7"
                                />
                            </div>
                            <div>
                                <Label htmlFor="editTelefono">Teléfono</Label>
                                <Input
                                    id="editTelefono"
                                    value={editForm.telefono || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, telefono: e.target.value }))}
                                    placeholder="3001234567"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="editEmail">Email</Label>
                            <Input
                                id="editEmail"
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="contacto@inmobiliaria.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="editDireccion">Dirección</Label>
                            <Input
                                id="editDireccion"
                                value={editForm.direccion || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, direccion: e.target.value }))}
                                placeholder="Calle 10 # 20-30, Bogotá"
                            />
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Label className="text-purple-800 font-medium">Inmobiliaria Actual</Label>
                            <p className="text-sm text-purple-600 mt-1">{editingInmobiliaria?.nombre}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingInmobiliaria(null);
                                setEditForm({});
                            }}
                            disabled={updateInmobiliariaMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={updateInmobiliariaMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {updateInmobiliariaMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

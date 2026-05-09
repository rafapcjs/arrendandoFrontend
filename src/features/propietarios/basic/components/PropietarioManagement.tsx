import { useState } from 'react';
import { usePropietarios } from '../query/propietarios';
import { useCreatePropietario, useUpdatePropietario, useActivatePropietario, useDeletePropietario } from '../query/propietario';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import type { Propietario, CreatePropietarioDto, UpdatePropietarioDto } from '../types/PropietarioModel';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';
import { isAdmin } from '../../../../shared/lib/session';
import { useInmobiliarias } from '../../../inmobiliarias/basic';

export const PropietarioManagement = () => {
    const adminUser = isAdmin();
    const [editingPropietario, setEditingPropietario] = useState<Propietario | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdatePropietarioDto>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreatePropietarioDto>({
        nombre: '',
        documento: '',
        telefono: '',
        email: '',
    });

    const { data: inmobiliarias } = useInmobiliarias();
    const [search, setSearch] = useState('');

    const { data: propietarios, isLoading, error } = usePropietarios();
    const createPropietarioMutation = useCreatePropietario();
    const updatePropietarioMutation = useUpdatePropietario();
    const activatePropietarioMutation = useActivatePropietario();
    const deletePropietarioMutation = useDeletePropietario();

    const filtered = (propietarios ?? []).filter((p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.documento.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (propietario: Propietario) => {
        setEditingPropietario(propietario);
        setEditForm({
            nombre: propietario.nombre,
            documento: propietario.documento,
            telefono: propietario.telefono,
            email: propietario.email,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingPropietario) return;
        try {
            await updatePropietarioMutation.mutateAsync({ id: editingPropietario.id, updateData: editForm });
            setShowEditModal(false);
            setEditingPropietario(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating propietario:', error);
        }
    };

    const handleCreate = async () => {
        try {
            await createPropietarioMutation.mutateAsync(createForm);
            setShowCreateModal(false);
            setCreateForm({ nombre: '', documento: '', telefono: '', email: '' });
        } catch (error) {
            console.error('Error creating propietario:', error);
        }
    };

    const handleActivate = async (id: string, isActive: boolean) => {
        try {
            await activatePropietarioMutation.mutateAsync({ id, activateData: { isActive } });
        } catch (error) {
            console.error('Error activating propietario:', error);
        }
    };

    const handleDelete = async (id: string) => {
        confirmDialog({
            title: '¿Eliminar propietario?',
            message: '¿Estás seguro de que quieres eliminar este propietario? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deletePropietarioMutation.mutateAsync(id);
                } catch (error) {
                    console.error('Error deleting propietario:', error);
                }
            },
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Gestión de Propietarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando propietarios...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-purple-800">Gestión de Propietarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar propietarios</p>
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
                            <CardTitle className="text-purple-800">Gestión de Propietarios</CardTitle>
                            <CardDescription>
                                Administra todos los propietarios del sistema - Total: {propietarios?.length ?? 0} propietarios
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            + Agregar Propietario
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800 mb-3">Buscar Propietarios</h3>
                        <Input
                            placeholder="Buscar por nombre, documento o email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {filtered.map((propietario) => (
                            <div key={propietario.id} className="border rounded-lg p-4 hover:bg-purple-50 transition-colors">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2 flex-grow">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-purple-800">
                                                {propietario.nombre}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                propietario.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {propietario.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                            <p className="text-gray-600"><span className="font-medium">Documento:</span> {propietario.documento}</p>
                                            <p className="text-gray-600"><span className="font-medium">Email:</span> {propietario.email}</p>
                                            <p className="text-gray-600"><span className="font-medium">Teléfono:</span> {propietario.telefono}</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Creado: {new Date(propietario.createdAt).toLocaleDateString()}</span>
                                            <span>Actualizado: {new Date(propietario.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(propietario)}
                                            disabled={updatePropietarioMutation.isPending}
                                            className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={propietario.isActive ? 'destructive' : 'default'}
                                            onClick={() => handleActivate(propietario.id, !propietario.isActive)}
                                            disabled={activatePropietarioMutation.isPending}
                                            className={!propietario.isActive ? 'bg-purple-600 hover:bg-purple-700' : ''}
                                        >
                                            {propietario.isActive ? 'Desactivar' : 'Activar'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(propietario.id)}
                                            disabled={deletePropietarioMutation.isPending}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {search ? 'No se encontraron propietarios con ese criterio' : 'No hay propietarios para mostrar'}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Agregar Nuevo Propietario</DialogTitle>
                        <DialogDescription>Registra un nuevo propietario en el sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        {adminUser && (
                            <div>
                                <Label htmlFor="createInmobiliaria">Inmobiliaria *</Label>
                                <select
                                    id="createInmobiliaria"
                                    value={createForm.inmobiliariaId || ''}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, inmobiliariaId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-input rounded-md"
                                    required
                                >
                                    <option value="">Selecciona una inmobiliaria</option>
                                    {(inmobiliarias ?? []).filter(i => i.estado === 'ACTIVA').map((i) => (
                                        <option key={i.id} value={i.id}>{i.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="createNombre">Nombre *</Label>
                            <Input
                                id="createNombre"
                                value={createForm.nombre}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, nombre: e.target.value }))}
                                placeholder="Carlos Ramírez López"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createDocumento">Documento *</Label>
                                <Input
                                    id="createDocumento"
                                    value={createForm.documento}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, documento: e.target.value }))}
                                    placeholder="12345678"
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
                                placeholder="carlos@correo.com"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateForm({ nombre: '', documento: '', telefono: '', email: '' });
                            }}
                            disabled={createPropietarioMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={
                                createPropietarioMutation.isPending ||
                                !createForm.nombre ||
                                !createForm.documento ||
                                !createForm.telefono ||
                                !createForm.email ||
                                (adminUser && !createForm.inmobiliariaId)
                            }
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {createPropietarioMutation.isPending ? 'Registrando...' : 'Registrar Propietario'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-purple-800">Editar Propietario</DialogTitle>
                        <DialogDescription>Editando: {editingPropietario?.nombre}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div>
                            <Label htmlFor="editNombre">Nombre</Label>
                            <Input
                                id="editNombre"
                                value={editForm.nombre || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, nombre: e.target.value }))}
                                placeholder="Carlos Ramírez López"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editDocumento">Documento</Label>
                                <Input
                                    id="editDocumento"
                                    value={editForm.documento || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, documento: e.target.value }))}
                                    placeholder="12345678"
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
                                placeholder="carlos@correo.com"
                            />
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <Label className="text-purple-800 font-medium">Propietario Actual</Label>
                            <p className="text-sm text-purple-600 mt-1">{editingPropietario?.nombre}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingPropietario(null);
                                setEditForm({});
                            }}
                            disabled={updatePropietarioMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={updatePropietarioMutation.isPending}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {updatePropietarioMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

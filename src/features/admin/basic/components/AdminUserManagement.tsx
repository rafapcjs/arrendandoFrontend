import { useState } from 'react';
import { useAdminUsers } from '../query/users';
import { useAdminUpdateUser, useAdminActivateUser, useAdminDeleteUser } from '../query/user';
import { useRegister } from '../../../auth/basic/query/register';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';
import type { User, UpdateUserDto } from '../types/AdminModel';
import type { CreateAdminDto } from '../../../auth/basic/types/AuthenticactionModel';

export const AdminUserManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdateUserDto>({});
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerForm, setRegisterForm] = useState<CreateAdminDto>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'ADMIN'
    });

    const { data: usersData, isLoading, error } = useAdminUsers(page, limit);
    const updateUserMutation = useAdminUpdateUser();
    const activateUserMutation = useAdminActivateUser();
    const deleteUserMutation = useAdminDeleteUser();
    const registerMutation = useRegister();

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        
        try {
            await updateUserMutation.mutateAsync({
                id: editingUser.id,
                data: editForm,
            });
            setShowEditModal(false);
            setEditingUser(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleActivate = async (userId: string, isActive: boolean) => {
        try {
            await activateUserMutation.mutateAsync({
                id: userId,
                data: { isActive },
            });
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDelete = async (userId: string) => {
        confirmDialog({
            title: '¿Eliminar usuario?',
            message: '¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteUserMutation.mutateAsync(userId);
                } catch (error) {
                    console.error('Error deleting user:', error);
                }
            }
        });
    };

    const handleRegister = async () => {
        try {
            await registerMutation.mutateAsync(registerForm);
            setShowRegisterModal(false);
            setRegisterForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                role: 'ADMIN'
            });
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando usuarios...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar usuarios</p>
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
                            <CardTitle>Gestión de Usuarios</CardTitle>
                            <CardDescription>
                                Administra todos los usuarios del sistema - Total: {usersData?.total || 0} usuarios
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={() => setShowRegisterModal(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            + Registrar Usuario
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {usersData?.data.map((user) => (
                            <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                user.isActive 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">{user.email}</p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <span>
                                                Rol: <span className="font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">{user.role}</span>
                                            </span>
                                            <span className="text-gray-500">
                                                Creado: {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-gray-500">
                                                Actualizado: {new Date(user.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(user)}
                                            disabled={updateUserMutation.isPending}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={user.isActive ? "destructive" : "default"}
                                            onClick={() => handleActivate(user.id, !user.isActive)}
                                            disabled={activateUserMutation.isPending}
                                        >
                                            {user.isActive ? 'Desactivar' : 'Activar'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deleteUserMutation.isPending}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {usersData?.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No hay usuarios para mostrar
                            </div>
                        )}
                    </div>

                    {/* Enhanced Pagination */}
                    {usersData && usersData.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(1)}
                                    disabled={page === 1}
                                >
                                    Primera
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Anterior
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    Página {page} de {usersData.totalPages}
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {usersData.total} usuarios total
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(usersData.totalPages, p + 1))}
                                    disabled={page === usersData.totalPages}
                                >
                                    Siguiente
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(usersData.totalPages)}
                                    disabled={page === usersData.totalPages}
                                >
                                    Última
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Register User Modal */}
            <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Registrar Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                            Crea una nueva cuenta de administrador en el sistema
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="regFirstName">Nombre *</Label>
                                <Input
                                    id="regFirstName"
                                    value={registerForm.firstName}
                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="Nombre"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="regLastName">Apellido *</Label>
                                <Input
                                    id="regLastName"
                                    value={registerForm.lastName}
                                    onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Apellido"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="regEmail">Email *</Label>
                            <Input
                                id="regEmail"
                                type="email"
                                value={registerForm.email}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="admin@ejemplo.com"
                                required
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="regPassword">Contraseña *</Label>
                            <Input
                                id="regPassword"
                                type="password"
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Contraseña segura"
                                required
                            />
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Label className="text-blue-800 font-medium">Rol</Label>
                            <p className="text-sm text-blue-600 mt-1">ADMIN (Administrador del sistema)</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowRegisterModal(false);
                                setRegisterForm({
                                    firstName: '',
                                    lastName: '',
                                    email: '',
                                    password: '',
                                    role: 'ADMIN'
                                });
                            }}
                            disabled={registerMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleRegister}
                            disabled={registerMutation.isPending || !registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {registerMutation.isPending ? 'Registrando...' : 'Registrar Usuario'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-blue-800">Editar Usuario</DialogTitle>
                        <DialogDescription>
                            Editando: {editingUser?.firstName} {editingUser?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editFirstName">Nombre *</Label>
                                <Input
                                    id="editFirstName"
                                    value={editForm.firstName || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="Nombre"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="editLastName">Apellido *</Label>
                                <Input
                                    id="editLastName"
                                    value={editForm.lastName || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Apellido"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <Label htmlFor="editEmail">Email *</Label>
                            <Input
                                id="editEmail"
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="email@ejemplo.com"
                                required
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="editRole">Rol *</Label>
                            <Input
                                id="editRole"
                                value={editForm.role || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="ADMIN, USER, etc."
                                required
                            />
                        </div>
                        
                        <div>
                            <Label htmlFor="editPassword">Nueva Contraseña (opcional)</Label>
                            <Input
                                id="editPassword"
                                type="password"
                                value={editForm.password || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Dejar vacío para mantener la actual"
                            />
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Label className="text-blue-800 font-medium">Usuario Actual</Label>
                            <p className="text-sm text-blue-600 mt-1">{editingUser?.firstName} {editingUser?.lastName}</p>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingUser(null);
                                setEditForm({});
                            }}
                            disabled={updateUserMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleUpdate}
                            disabled={updateUserMutation.isPending || !editForm.firstName || !editForm.lastName || !editForm.email || !editForm.role}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {updateUserMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
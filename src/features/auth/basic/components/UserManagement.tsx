import { useState } from 'react';
import { useUsers, useUpdateUser, useActivateUser, useDeleteUser } from '../query/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';
import type { User, UpdateUserDto } from '../types/AuthenticactionModel';

export const UserManagement = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<UpdateUserDto>({});

    const { data: usersData, isLoading, error } = useUsers(page, limit);
    const updateUserMutation = useUpdateUser();
    const activateUserMutation = useActivateUser();
    const deleteUserMutation = useDeleteUser();

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        
        try {
            await updateUserMutation.mutateAsync({
                id: editingUser.id,
                data: editForm,
            });
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

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Loading users...</p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Error loading users</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                        Manage users - Total: {usersData?.total || 0} users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {usersData?.data.map((user) => (
                            <div key={user.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-sm">
                                            Role: <span className="font-medium">{user.role}</span>
                                        </p>
                                        <p className="text-sm">
                                            Status: 
                                            <span className={`ml-1 font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={user.isActive ? "destructive" : "default"}
                                            onClick={() => handleActivate(user.id, !user.isActive)}
                                        >
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {usersData && usersData.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span>
                                Page {page} of {usersData.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(usersData.totalPages, p + 1))}
                                disabled={page === usersData.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Modal */}
            <Dialog open={!!editingUser} onOpenChange={(open) => {
                if (!open) {
                    setEditingUser(null);
                    setEditForm({});
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Editing {editingUser?.firstName} {editingUser?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={editForm.firstName || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={editForm.lastName || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Input
                                id="role"
                                value={editForm.role || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                placeholder="USER, ADMIN, etc."
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">New Password (optional)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={editForm.password || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="Leave empty to keep current password"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setEditingUser(null);
                                setEditForm({});
                            }}
                            disabled={updateUserMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdate} 
                            disabled={updateUserMutation.isPending || !editForm.firstName || !editForm.lastName || !editForm.email}
                        >
                            {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
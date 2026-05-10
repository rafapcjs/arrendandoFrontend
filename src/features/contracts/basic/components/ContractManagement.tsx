import { useState, useRef } from 'react';
import { useContracts } from '../query/contracts';
import { useUpdateContract, useDeleteContract, useCreateContract, useUploadContractDocument, useReplaceContractDocument, useDeleteContractDocument } from '../query/contract';
import { useTenants } from '../../../tenants/basic/query/tenants';
import { useProperties } from '../../../properties/basic/query/properties';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../../../shared/components/ui/dialog';
import { confirmDialog } from '../../../../shared/lib/confirmDialog';
import { toast } from 'react-toastify';
import { ChevronDown, ChevronUp, Upload, Eye, Trash2, RefreshCw, Paperclip, X } from 'lucide-react';
import type { Contract, UpdateContractDto, CreateContractDto, ContractSearchParams, ContratoEstado, ContratoDocumento } from '../types/ContractModel';

export const ContractManagement = () => {
    const [page] = useState(1);
    const [limit] = useState(10);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState<UpdateContractDto>({});
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState<CreateContractDto>({
        fechaInicio: '',
        fechaFin: '',
        canonMensual: 0,
        estado: 'BORRADOR' as ContratoEstado,
        inquilinoId: '',
        inmuebleId: ''
    });
    const [searchParams, setSearchParams] = useState<ContractSearchParams>({
        page,
        limit
    });
    const [searchInput, setSearchInput] = useState('');
    const [activeSearchTerm, setActiveSearchTerm] = useState('');
    const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
    const [editErrors, setEditErrors] = useState<Record<string, string>>({});

    // Get contracts without the inquilinoNombre filter (handle it in frontend)
    const backendSearchParams = {
        ...searchParams,
        inquilinoNombre: undefined
    };
    const { data: contractsData, isLoading, error } = useContracts(backendSearchParams);

    // Filter contracts in frontend based on tenant name
    const filteredContracts = contractsData?.data.filter(contract => {
        if (!activeSearchTerm.trim()) return true;
        
        const fullName = `${contract.inquilino.nombres} ${contract.inquilino.apellidos}`.toLowerCase();
        return fullName.includes(activeSearchTerm.toLowerCase());
    }) || [];

    // Create filtered response object
    const filteredContractsData = contractsData ? {
        ...contractsData,
        data: filteredContracts,
        total: filteredContracts.length,
        totalPages: Math.ceil(filteredContracts.length / (searchParams.limit || 10))
    } : null;
    const { data: tenantsData } = useTenants();
    const { data: propertiesData } = useProperties();
    
    // Get active contracts to filter out occupied tenants and properties
    const { data: activeContractsData } = useContracts({ estado: 'ACTIVO' });
    
    // Filter available tenants (exclude those with active contracts)
    const availableTenants = tenantsData?.data.filter(tenant => {
        if (!tenant.isActive) return false;
        // Check if tenant has any active contract
        const hasActiveContract = activeContractsData?.data.some(contract => 
            contract.inquilinoId === tenant.id
        );
        return !hasActiveContract;
    }) || [];
    
    // Filter available properties (exclude those with active contracts)
    const availableProperties = propertiesData?.data.filter(property => {
        if (!property.disponible) return false;
        // Check if property has any active contract
        const hasActiveContract = activeContractsData?.data.some(contract => 
            contract.inmuebleId === property.id
        );
        return !hasActiveContract;
    }) || [];

    const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<ContratoDocumento | null>(null);
    const [previewContractId, setPreviewContractId] = useState<string | null>(null);
    const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [replacingDoc, setReplacingDoc] = useState<{ contractId: string; docId: string } | null>(null);
    const [uploadingForContractId, setUploadingForContractId] = useState<string | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const replaceInputRef = useRef<HTMLInputElement>(null);

    const updateContractMutation = useUpdateContract();
    const deleteContractMutation = useDeleteContract();
    const createContractMutation = useCreateContract();
    const uploadDocMutation = useUploadContractDocument();
    const replaceDocMutation = useReplaceContractDocument();
    const deleteDocMutation = useDeleteContractDocument();

    const handleEdit = (contract: Contract) => {
        setEditingContract(contract);
        setEditForm({
            fechaInicio: contract.fechaInicio.split('T')[0],
            fechaFin: contract.fechaFin.split('T')[0],
            canonMensual: contract.canonMensual,
            estado: contract.estado,
            inquilinoId: contract.inquilinoId,
            inmuebleId: contract.inmuebleId,
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingContract) return;

        const errs: Record<string, string> = {};
        if (editForm.fechaInicio && editForm.fechaFin) {
            const startDate = new Date(editForm.fechaInicio);
            const endDate = new Date(editForm.fechaFin);
            if (startDate >= endDate) errs.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
        if (editForm.canonMensual !== undefined && editForm.canonMensual <= 0) {
            errs.canonMensual = 'El canon mensual debe ser mayor a 0';
        }
        if (Object.keys(errs).length > 0) {
            setEditErrors(errs);
            return;
        }
        
        // Transform canonMensual to two decimal places before sending to backend
        const transformedEditForm = { ...editForm };
        if (transformedEditForm.canonMensual !== undefined) {
            transformedEditForm.canonMensual = parseFloat(transformedEditForm.canonMensual.toFixed(2));
        }
        
        try {
            await updateContractMutation.mutateAsync({
                id: editingContract.id,
                data: transformedEditForm,
            });
            setShowEditModal(false);
            setEditingContract(null);
            setEditForm({});
            setEditErrors({});
        } catch (error: unknown) {
            console.error('Error updating contract:', error);
        }
    };

    const handleDelete = async (contractId: string) => {
        confirmDialog({
            title: '¿Eliminar contrato?',
            message: '¿Estás seguro de que quieres eliminar este contrato? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteContractMutation.mutateAsync(contractId);
                } catch (error: unknown) {
                    console.error('Error deleting contract:', error);
                }
            }
        });
    };

    const handleCreate = async () => {
        const errs: Record<string, string> = {};
        if (!createForm.fechaInicio) errs.fechaInicio = 'La fecha de inicio es requerida';
        if (!createForm.fechaFin) errs.fechaFin = 'La fecha de fin es requerida';
        if (!createForm.canonMensual || createForm.canonMensual <= 0) errs.canonMensual = 'El canon mensual debe ser mayor a 0';
        if (!createForm.inquilinoId) errs.inquilinoId = 'Selecciona un inquilino';
        if (!createForm.inmuebleId) errs.inmuebleId = 'Selecciona una propiedad';
        if (createForm.fechaInicio && createForm.fechaFin) {
            const startDate = new Date(createForm.fechaInicio);
            const endDate = new Date(createForm.fechaFin);
            if (startDate >= endDate) errs.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
        }
        if (Object.keys(errs).length > 0) {
            setCreateErrors(errs);
            return;
        }

        // Transform canonMensual to two decimal places before sending to backend
        const transformedCreateForm = { 
            ...createForm,
            canonMensual: parseFloat(createForm.canonMensual.toFixed(2))
        };

        try {
            await createContractMutation.mutateAsync(transformedCreateForm);
            setShowCreateModal(false);
            setCreateForm({
                fechaInicio: '',
                fechaFin: '',
                canonMensual: 0,
                estado: 'BORRADOR' as ContratoEstado,
                inquilinoId: '',
                inmuebleId: ''
            });
        } catch (error: unknown) {
            console.error('Error creating contract:', error);
        }
    };

    const handleUploadClick = (contractId: string) => {
        setUploadingForContractId(contractId);
        uploadInputRef.current!.value = '';
        uploadInputRef.current?.click();
    };

    const handleUploadFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingForContractId) return;
        try {
            await uploadDocMutation.mutateAsync({ contractId: uploadingForContractId, file });
        } catch {
            // error handled in mutation
        }
        setUploadingForContractId(null);
    };

    const handleReplaceClick = (contractId: string, docId: string) => {
        setReplacingDoc({ contractId, docId });
        replaceInputRef.current!.value = '';
        replaceInputRef.current?.click();
    };

    const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !replacingDoc) return;
        try {
            await replaceDocMutation.mutateAsync({ contractId: replacingDoc.contractId, docId: replacingDoc.docId, file });
        } catch {
            // error handled in mutation
        }
        setReplacingDoc(null);
    };

    const handleDeleteDocument = (contractId: string, docId: string, nombre: string) => {
        confirmDialog({
            title: '¿Eliminar documento?',
            message: `¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            onConfirm: async () => {
                try {
                    await deleteDocMutation.mutateAsync({ contractId, docId });
                } catch {
                    // error handled in mutation
                }
            }
        });
    };

    const getDocIcon = (tipo: string) => {
        if (tipo.includes('pdf')) return '📄';
        if (tipo.includes('word') || tipo.includes('document')) return '📝';
        if (tipo.includes('image')) return '🖼️';
        return '📎';
    };

    const handleOpenPreview = async (contractId: string, doc: ContratoDocumento) => {
        setPreviewDoc(doc);
        setPreviewContractId(contractId);
        if (doc.tipo.startsWith('image/')) return;

        setPreviewLoading(true);
        try {
            const { ApiIntance } = await import('../../../../infrastructure/api');
            const res = await ApiIntance.get(
                `/contratos/${contractId}/documentos/${doc.docId}/stream`,
                { responseType: 'blob' }
            );
            const blobUrl = URL.createObjectURL(new Blob([res.data], { type: doc.tipo }));
            setPreviewBlobUrl(blobUrl);
        } catch {
            toast.error('No se pudo cargar la vista previa');
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!previewDoc || !previewContractId) return;
        try {
            const { ApiIntance } = await import('../../../../infrastructure/api');
            const res = await ApiIntance.get(
                `/contratos/${previewContractId}/documentos/${previewDoc.docId}/stream`,
                { responseType: 'blob' }
            );
            const blob = new Blob([res.data], { type: previewDoc.tipo });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = previewDoc.nombre;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            toast.error('No se pudo descargar el documento');
        }
    };

    const handleClosePreview = () => {
        if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
        setPreviewDoc(null);
        setPreviewContractId(null);
        setPreviewBlobUrl(null);
    };

    const handleSearch = () => {
        setActiveSearchTerm(searchInput.trim());
        setSearchParams(prev => ({
            ...prev,
            page: 1
        }));
    };

    const clearSearch = () => {
        setSearchInput('');
        setActiveSearchTerm('');
        setSearchParams({
            page: 1,
            limit: 10
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (estado: ContratoEstado) => {
        switch (estado) {
            case 'ACTIVO':
                return 'bg-green-100 text-green-800';
            case 'BORRADOR':
                return 'bg-gray-100 text-gray-800';
            case 'PROXIMO_VENCER':
                return 'bg-yellow-100 text-yellow-800';
            case 'VENCIDO':
                return 'bg-red-100 text-red-800';
            case 'FINALIZADO':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (estado: ContratoEstado) => {
        switch (estado) {
            case 'ACTIVO':
                return 'Activo';
            case 'BORRADOR':
                return 'Borrador';
            case 'PROXIMO_VENCER':
                return 'Próximo a Vencer';
            case 'VENCIDO':
                return 'Vencido';
            case 'FINALIZADO':
                return 'Finalizado';
            default:
                return estado;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Gestión de Contratos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p>Cargando contratos...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-green-800">Gestión de Contratos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-32">
                        <p className="text-red-600">Error al cargar contratos</p>
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
                            <CardTitle className="text-green-800">Gestión de Contratos</CardTitle>
                            <CardDescription>
                                Administra todos los contratos del sistema - Total: {filteredContractsData?.total || 0} contratos
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                + Crear Contrato
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filter Section */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800 mb-3">Buscar y Filtrar Contratos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <div className="md:col-span-2">
                                <Input
                                    placeholder="Buscar por nombre del inquilino..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="border-green-300 focus:border-green-500"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <select
                                value={searchParams.estado || ''}
                                onChange={(e) => setSearchParams(prev => ({ 
                                    ...prev, 
                                    estado: e.target.value === '' ? undefined : e.target.value as ContratoEstado,
                                    page: 1
                                }))}
                                className="px-3 py-2 border border-input rounded-md border-green-300 focus:border-green-500"
                            >
                                <option value="">Todos los estados</option>
                                <option value="BORRADOR">Borrador</option>
                                <option value="ACTIVO">Activo</option>
                                <option value="PROXIMO_VENCER">Próximo a Vencer</option>
                                <option value="VENCIDO">Vencido</option>
                                <option value="FINALIZADO">Finalizado</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                onClick={handleSearch}
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Buscar
                            </Button>
                            {(activeSearchTerm || searchParams.estado) && (
                                <Button 
                                    onClick={clearSearch}
                                    size="sm" 
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredContractsData?.data.map((contract) => (
                            <div key={contract.id} className="border rounded-lg hover:bg-green-50 transition-colors overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg text-green-800">
                                                    Contrato #{contract.id.slice(-8)}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.estado)}`}>
                                                    {getStatusText(contract.estado)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Inquilino:</span> {contract.inquilino.nombres} {contract.inquilino.apellidos}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Propiedad:</span> {contract.inmueble.direccion}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Canon Mensual:</span> {formatCurrency(contract.canonMensual)}
                                                </p>
                                                <p className="text-gray-600">
                                                    <span className="font-medium">Vigencia:</span> {new Date(contract.fechaInicio).toLocaleDateString()} - {new Date(contract.fechaFin).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span>Creado: {new Date(contract.createdAt).toLocaleDateString()}</span>
                                                <span>Actualizado: {new Date(contract.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-wrap ml-4">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(contract)}
                                                disabled={updateContractMutation.isPending}
                                                className="border-green-300 text-green-700 hover:bg-green-50"
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(contract.id)}
                                                disabled={deleteContractMutation.isPending}
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Toggle documentos */}
                                    <button
                                        onClick={() => setExpandedContractId(expandedContractId === contract.id ? null : contract.id)}
                                        className="mt-3 flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                        Documentos ({contract.documentos?.length ?? 0})
                                        {expandedContractId === contract.id
                                            ? <ChevronUp className="w-4 h-4" />
                                            : <ChevronDown className="w-4 h-4" />
                                        }
                                    </button>
                                </div>

                                {/* Sección documentos expandida */}
                                {expandedContractId === contract.id && (
                                    <div className="border-t border-green-100 bg-green-50 px-4 py-3 space-y-2">
                                        {contract.documentos?.length === 0 && (
                                            <p className="text-sm text-gray-500 italic">No hay documentos adjuntos.</p>
                                        )}

                                        {contract.documentos?.map((doc) => (
                                            <div key={doc.docId} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-green-100">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="text-lg flex-shrink-0">{getDocIcon(doc.tipo)}</span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{doc.nombre}</p>
                                                        <p className="text-xs text-gray-400">{new Date(doc.subidoEn).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0 ml-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                                                        onClick={() => handleOpenPreview(contract.id, doc)}
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" /> Ver
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-2 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                                                        onClick={() => handleReplaceClick(contract.id, doc.docId)}
                                                        disabled={replaceDocMutation.isPending}
                                                    >
                                                        <RefreshCw className="w-3 h-3 mr-1" /> Reemplazar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteDocument(contract.id, doc.docId, doc.nombre)}
                                                        disabled={deleteDocMutation.isPending}
                                                    >
                                                        <Trash2 className="w-3 h-3 mr-1" /> Eliminar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        <Button
                                            size="sm"
                                            className="mt-1 bg-green-600 hover:bg-green-700 h-8 text-xs"
                                            onClick={() => handleUploadClick(contract.id)}
                                            disabled={uploadDocMutation.isPending && uploadingForContractId === contract.id}
                                        >
                                            <Upload className="w-3 h-3 mr-1" />
                                            {uploadDocMutation.isPending && uploadingForContractId === contract.id
                                                ? 'Subiendo...'
                                                : 'Subir documento'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredContractsData?.data.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {activeSearchTerm ? 'No se encontraron contratos con ese nombre de inquilino' : 'No hay contratos para mostrar'}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredContractsData && filteredContractsData.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchParams(prev => ({ ...prev, page: 1 }))}
                                    disabled={searchParams.page === 1}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Primera
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchParams(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                                    disabled={searchParams.page === 1}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Anterior
                                </Button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    Página {searchParams.page} de {filteredContractsData.totalPages}
                                </span>
                                <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
                                    {filteredContractsData.total} contratos total
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchParams(prev => ({ ...prev, page: Math.min(filteredContractsData.totalPages, (prev.page || 1) + 1) }))}
                                    disabled={searchParams.page === filteredContractsData.totalPages}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Siguiente
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSearchParams(prev => ({ ...prev, page: filteredContractsData.totalPages }))}
                                    disabled={searchParams.page === filteredContractsData.totalPages}
                                    className="border-green-300 text-green-700 hover:bg-green-50"
                                >
                                    Última
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Contract Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Crear Nuevo Contrato</DialogTitle>
                        <DialogDescription>
                            Crea un nuevo contrato de arrendamiento
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="createFechaInicio">Fecha de Inicio *</Label>
                                <Input
                                    id="createFechaInicio"
                                    type="date"
                                    value={createForm.fechaInicio}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, fechaInicio: e.target.value }))}
                                    className={createErrors.fechaInicio ? 'border-red-500' : ''}
                                />
                                {createErrors.fechaInicio && <p className="text-red-500 text-xs mt-1">{createErrors.fechaInicio}</p>}
                            </div>
                            <div>
                                <Label htmlFor="createFechaFin">Fecha de Fin *</Label>
                                <Input
                                    id="createFechaFin"
                                    type="date"
                                    value={createForm.fechaFin}
                                    onChange={(e) => setCreateForm(prev => ({ ...prev, fechaFin: e.target.value }))}
                                    className={createErrors.fechaFin ? 'border-red-500' : ''}
                                />
                                {createErrors.fechaFin && <p className="text-red-500 text-xs mt-1">{createErrors.fechaFin}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="createCanonMensual">Canon Mensual *</Label>
                            <Input
                                id="createCanonMensual"
                                type="number"
                                step="0.01"
                                min="0"
                                value={createForm.canonMensual}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || value === '.') {
                                        setCreateForm(prev => ({ ...prev, canonMensual: 0 }));
                                    } else {
                                        const numValue = parseFloat(value);
                                        if (!isNaN(numValue) && numValue >= 0) {
                                            setCreateForm(prev => ({ ...prev, canonMensual: numValue }));
                                        }
                                    }
                                }}
                                placeholder="1500000.00"
                                className={createErrors.canonMensual ? 'border-red-500' : ''}
                            />
                            {createErrors.canonMensual && <p className="text-red-500 text-xs mt-1">{createErrors.canonMensual}</p>}
                        </div>

                        <div>
                            <Label htmlFor="createEstado">Estado *</Label>
                            <select
                                id="createEstado"
                                value={createForm.estado}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, estado: e.target.value as ContratoEstado }))}
                                className="w-full px-3 py-2 border border-input rounded-md"
                            >
                                <option value="BORRADOR">Borrador</option>
                                <option value="ACTIVO">Activo</option>
                            </select>
                        </div>

                        <div>
                            <Label htmlFor="createInquilino">Inquilino *</Label>
                            <select
                                id="createInquilino"
                                value={createForm.inquilinoId}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, inquilinoId: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md ${createErrors.inquilinoId ? 'border-red-500' : 'border-input'}`}
                            >
                                <option value="">Seleccionar inquilino</option>
                                {availableTenants.map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.nombres} {tenant.apellidos} - {tenant.cedula}
                                    </option>
                                ))}
                            </select>
                            {createErrors.inquilinoId && <p className="text-red-500 text-xs mt-1">{createErrors.inquilinoId}</p>}
                        </div>

                        <div>
                            <Label htmlFor="createInmueble">Propiedad *</Label>
                            <select
                                id="createInmueble"
                                value={createForm.inmuebleId}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, inmuebleId: e.target.value }))}
                                className={`w-full px-3 py-2 border rounded-md ${createErrors.inmuebleId ? 'border-red-500' : 'border-input'}`}
                            >
                                <option value="">Seleccionar propiedad</option>
                                {availableProperties.map((property) => (
                                    <option key={property.id} value={property.id}>
                                        {property.direccion}
                                    </option>
                                ))}
                            </select>
                            {createErrors.inmuebleId && <p className="text-red-500 text-xs mt-1">{createErrors.inmuebleId}</p>}
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowCreateModal(false);
                                setCreateErrors({});
                                setCreateForm({
                                    fechaInicio: '',
                                    fechaFin: '',
                                    canonMensual: 0,
                                    estado: 'BORRADOR' as ContratoEstado,
                                    inquilinoId: '',
                                    inmuebleId: ''
                                });
                            }}
                            disabled={createContractMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleCreate}
                            disabled={createContractMutation.isPending || !createForm.fechaInicio || !createForm.fechaFin || !createForm.canonMensual || !createForm.inquilinoId || !createForm.inmuebleId}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {createContractMutation.isPending ? 'Creando...' : 'Crear Contrato'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal preview de documento */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-4xl" style={{ height: '90vh' }}>
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-lg">{getDocIcon(previewDoc.tipo)}</span>
                                <p className="font-medium text-gray-800 truncate">{previewDoc.nombre}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs"
                                    onClick={handleDownload}
                                >
                                    Descargar
                                </Button>
                                <button
                                    onClick={handleClosePreview}
                                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden rounded-b-xl">
                            {previewDoc.tipo.startsWith('image/') ? (
                                <div className="h-full flex items-center justify-center bg-gray-50 p-4">
                                    <img
                                        src={previewDoc.url}
                                        alt={previewDoc.nombre}
                                        className="max-h-full max-w-full object-contain rounded"
                                    />
                                </div>
                            ) : previewLoading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-500">
                                    <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
                                    <p className="text-sm">Cargando documento...</p>
                                </div>
                            ) : previewBlobUrl ? (
                                <iframe
                                    src={previewBlobUrl}
                                    className="w-full h-full border-0"
                                    title={previewDoc.nombre}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-500">
                                    <p className="text-sm">No se pudo cargar la vista previa.</p>
                                    <Button size="sm" onClick={handleDownload}>
                                        Descargar archivo
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Inputs ocultos para subir/reemplazar documentos */}
            <input
                ref={uploadInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleUploadFileSelected}
            />
            <input
                ref={replaceInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleReplaceFileSelected}
            />

            {/* Edit Contract Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Editar Contrato</DialogTitle>
                        <DialogDescription>
                            Editando contrato #{editingContract?.id.slice(-8)}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 p-6 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="editFechaInicio">Fecha de Inicio</Label>
                                <Input
                                    id="editFechaInicio"
                                    type="date"
                                    value={editForm.fechaInicio || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, fechaInicio: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="editFechaFin">Fecha de Fin</Label>
                                <Input
                                    id="editFechaFin"
                                    type="date"
                                    value={editForm.fechaFin || ''}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, fechaFin: e.target.value }))}
                                    className={editErrors.fechaFin ? 'border-red-500' : ''}
                                />
                                {editErrors.fechaFin && <p className="text-red-500 text-xs mt-1">{editErrors.fechaFin}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="editCanonMensual">Canon Mensual</Label>
                            <Input
                                id="editCanonMensual"
                                type="number"
                                step="0.01"
                                min="0"
                                value={editForm.canonMensual || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || value === '.') {
                                        setEditForm(prev => ({ ...prev, canonMensual: 0 }));
                                    } else {
                                        const numValue = parseFloat(value);
                                        if (!isNaN(numValue) && numValue >= 0) {
                                            setEditForm(prev => ({ ...prev, canonMensual: numValue }));
                                        }
                                    }
                                }}
                                placeholder="1500000.00"
                                className={editErrors.canonMensual ? 'border-red-500' : ''}
                            />
                            {editErrors.canonMensual && <p className="text-red-500 text-xs mt-1">{editErrors.canonMensual}</p>}
                        </div>
                        
                        <div>
                            <Label htmlFor="editEstado">Estado</Label>
                            <select
                                id="editEstado"
                                value={editForm.estado || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, estado: e.target.value as ContratoEstado }))}
                                className="w-full px-3 py-2 border border-input rounded-md"
                            >
                                <option value="BORRADOR">Borrador</option>
                                <option value="ACTIVO">Activo</option>
                            </select>
                        </div>
                        
                        <div>
                            <Label htmlFor="editInquilino">Inquilino</Label>
                            <select
                                id="editInquilino"
                                value={editForm.inquilinoId || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, inquilinoId: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md"
                            >
                                <option value="">Seleccionar inquilino</option>
                                {tenantsData?.data.filter(tenant => tenant.isActive).map((tenant) => (
                                    <option key={tenant.id} value={tenant.id}>
                                        {tenant.nombres} {tenant.apellidos} - {tenant.cedula}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <Label htmlFor="editInmueble">Propiedad</Label>
                            <select
                                id="editInmueble"
                                value={editForm.inmuebleId || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, inmuebleId: e.target.value }))}
                                className="w-full px-3 py-2 border border-input rounded-md"
                            >
                                <option value="">Seleccionar propiedad</option>
                                {propertiesData?.data.filter(property => property.disponible).map((property) => (
                                    <option key={property.id} value={property.id}>
                                        {property.direccion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingContract(null);
                                setEditForm({});
                                setEditErrors({});
                            }}
                            disabled={updateContractMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleUpdate}
                            disabled={updateContractMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {updateContractMutation.isPending ? 'Actualizando...' : 'Guardar Cambios'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
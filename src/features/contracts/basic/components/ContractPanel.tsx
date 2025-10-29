import { AppLayout } from '../../../../shared/components/layout/AppLayout';
import { ContractManagement } from './ContractManagement';

export const ContractPanel = () => {
    return (
        <AppLayout>
            <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-green-800 mb-2">
                            Panel de Contratos
                        </h1>
                        <p className="text-green-600">
                            Gestiona todos los contratos de arrendamiento del sistema
                        </p>
                    </div>
                    <ContractManagement />
                </div>
            </div>
        </AppLayout>
    );
};
import React from 'react';
import { PaymentStats } from './PaymentStats';
import { PaymentManagement } from './PaymentManagement';

export const PaymentPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Gestión de Pagos
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Administra los pagos de tus contratos, registra abonos y mantén el control 
              de las finanzas de tu negocio de arriendos.
            </p>
          </div>

          {/* Stats */}
          <PaymentStats />

          {/* Management */}
          <PaymentManagement />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, User, Home } from 'lucide-react';
import type { Payment } from '../types/PaymentModel';
import { formatCurrency, formatDate, getPaymentStatusColor, getPaymentStatusText } from '../service';

interface PaymentCardProps {
  payment: Payment;
  onAbono?: (payment: Payment) => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onAbono
}) => {
  const montoTotal = parseFloat(payment.montoTotal);
  const montoAbonado = parseFloat(payment.montoAbonado);
  const montoPendiente = montoTotal - montoAbonado;
  const porcentajePagado = montoTotal > 0 ? (montoAbonado / montoTotal) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAGADO':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'PARCIAL':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'PENDIENTE':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-slate-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Pago {formatCurrency(montoTotal)}
              </h3>
              <div className="space-y-1 mt-1">
                {payment.contrato?.inquilino && (
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-medium">Inquilino:</span> {payment.contrato.inquilino.nombres} {payment.contrato.inquilino.apellidos}
                  </p>
                )}
                {payment.contrato?.inmueble && (
                  <p className="text-sm text-slate-600 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span className="font-medium">Inmueble:</span> {payment.contrato.inmueble.direccion}
                  </p>
                )}
                {!payment.contrato?.inquilino && !payment.contrato?.inmueble && (
                  <p className="text-sm text-slate-600">
                    Contrato: {payment.contrato?.nombre || payment.contratoId.slice(0, 8)}...
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(payment.estado)}
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(payment.estado)}`}>
              {getPaymentStatusText(payment.estado)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Progreso de pago</span>
            <span className="font-medium text-slate-800">
              {porcentajePagado.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                payment.estado === 'PAGADO' 
                  ? 'bg-green-500' 
                  : payment.estado === 'PARCIAL' 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(porcentajePagado, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Total:</span>
              <span className="font-medium text-slate-800">
                {formatCurrency(montoTotal)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-slate-600">Abonado:</span>
              <span className="font-medium text-green-700">
                {formatCurrency(montoAbonado)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-slate-600">Pendiente:</span>
              <span className="font-medium text-red-700">
                {formatCurrency(montoPendiente)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600">Vencimiento:</span>
            </div>
            <p className="text-sm font-medium text-slate-800 ml-6">
              {formatDate(payment.fechaPagoEsperada)}
            </p>
            {payment.fechaPagoReal && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-slate-600">Pagado:</span>
                </div>
                <p className="text-sm font-medium text-green-700 ml-6">
                  {formatDate(payment.fechaPagoReal)}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          {payment.estado !== 'PAGADO' && onAbono && (
            <button
              onClick={() => onAbono(payment)}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Registrar Abono
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
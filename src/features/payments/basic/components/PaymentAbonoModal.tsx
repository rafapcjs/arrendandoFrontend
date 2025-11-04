import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { usePaymentAbono } from '../query/payment-abono';
import { formatCurrency, validateISODate } from '../service';
import type { Payment, PaymentAbonoDto } from '../types/PaymentModel';

interface PaymentAbonoModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const PaymentAbonoModal: React.FC<PaymentAbonoModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const [formData, setFormData] = useState<PaymentAbonoDto>({
    monto: 0,
    fechaPago: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentAbonoMutation = usePaymentAbono();

  const montoPendiente = payment ? 
    parseFloat(payment.montoTotal) - parseFloat(payment.montoAbonado) : 0;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.monto || formData.monto <= 0 || isNaN(formData.monto)) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    } else if (formData.monto > montoPendiente) {
      newErrors.monto = 'El monto no puede ser mayor al pendiente';
    }

    if (formData.fechaPago && !validateISODate(formData.fechaPago)) {
      newErrors.fechaPago = 'Formato de fecha inválido (YYYY-MM-DD)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment || !validateForm()) {
      return;
    }

    try {
      const submitData: PaymentAbonoDto = {
        monto: formData.monto,
        ...(formData.fechaPago && { fechaPago: formData.fechaPago })
      };

      await paymentAbonoMutation.mutateAsync({
        id: payment.id,
        data: submitData
      });
      handleClose();
    } catch {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    setFormData({
      monto: 0,
      fechaPago: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    onClose();
  };

  const handleMontoClick = (percentage: number) => {
    const amount = Math.round(montoPendiente * percentage);
    setFormData(prev => ({ ...prev, monto: amount }));
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Registrar Abono</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Payment Info */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Pago {formatCurrency(parseFloat(payment.montoTotal))}
                </h3>
                <p className="text-sm text-slate-600">
                  Estado: {payment.estado}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Total:</span>
                <p className="font-medium text-slate-800">
                  {formatCurrency(parseFloat(payment.montoTotal))}
                </p>
              </div>
              <div>
                <span className="text-slate-600">Abonado:</span>
                <p className="font-medium text-green-700">
                  {formatCurrency(parseFloat(payment.montoAbonado))}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-600">Pendiente:</span>
                <p className="font-bold text-red-700">
                  {formatCurrency(montoPendiente)}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Montos rápidos
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleMontoClick(0.25)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => handleMontoClick(0.5)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => handleMontoClick(1)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  Total
                </button>
              </div>
            </div>

            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monto del Abono *
              </label>
              <input
                type="number"
                min="0"
                max={montoPendiente}
                step="any"
                value={formData.monto || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  monto: e.target.value ? parseFloat(e.target.value) : 0
                }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.monto ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Ej: 500000"
              />
              {errors.monto && (
                <p className="text-red-600 text-sm mt-1">{errors.monto}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Máximo: {formatCurrency(montoPendiente)}
              </p>
            </div>

            {/* Fecha de Pago */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Pago (opcional)
              </label>
              <input
                type="date"
                value={formData.fechaPago || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fechaPago: e.target.value
                }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fechaPago ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.fechaPago && (
                <p className="text-red-600 text-sm mt-1">{errors.fechaPago}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Si no se especifica, se usará la fecha actual
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={paymentAbonoMutation.isPending}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {paymentAbonoMutation.isPending ? 'Registrando...' : 'Registrar Abono'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
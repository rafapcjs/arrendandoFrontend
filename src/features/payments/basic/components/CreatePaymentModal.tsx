import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreatePayment } from '../query/create-payment';
import { validateUUID, validateISODate } from '../service';
import type { CreatePaymentDto } from '../types/PaymentModel';

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState<CreatePaymentDto>({
    montoTotal: 0,
    fechaPagoEsperada: '',
    contratoId: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createPaymentMutation = useCreatePayment();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.montoTotal || formData.montoTotal <= 0) {
      newErrors.montoTotal = 'El monto debe ser mayor a 0';
    }

    if (!formData.fechaPagoEsperada) {
      newErrors.fechaPagoEsperada = 'La fecha de pago es requerida';
    } else if (!validateISODate(formData.fechaPagoEsperada)) {
      newErrors.fechaPagoEsperada = 'Formato de fecha inválido (YYYY-MM-DD)';
    }

    if (!formData.contratoId) {
      newErrors.contratoId = 'El ID del contrato es requerido';
    } else if (!validateUUID(formData.contratoId)) {
      newErrors.contratoId = 'Formato de UUID inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createPaymentMutation.mutateAsync(formData);
      handleClose();
    } catch {
      // Error handling is done in the mutation
    }
  };

  const handleClose = () => {
    setFormData({
      montoTotal: 0,
      fechaPagoEsperada: '',
      contratoId: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Crear Nuevo Pago</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Monto Total */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Monto Total *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.montoTotal || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  montoTotal: parseFloat(e.target.value) || 0
                }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.montoTotal ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Ej: 1200000"
              />
              {errors.montoTotal && (
                <p className="text-red-600 text-sm mt-1">{errors.montoTotal}</p>
              )}
            </div>

            {/* Fecha de Pago Esperada */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha de Pago Esperada *
              </label>
              <input
                type="date"
                value={formData.fechaPagoEsperada}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fechaPagoEsperada: e.target.value
                }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.fechaPagoEsperada ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.fechaPagoEsperada && (
                <p className="text-red-600 text-sm mt-1">{errors.fechaPagoEsperada}</p>
              )}
            </div>

            {/* Contrato ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ID del Contrato *
              </label>
              <input
                type="text"
                value={formData.contratoId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contratoId: e.target.value
                }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.contratoId ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
              {errors.contratoId && (
                <p className="text-red-600 text-sm mt-1">{errors.contratoId}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                Formato UUID válido requerido
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
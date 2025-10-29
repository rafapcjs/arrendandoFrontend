import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../shared/components/ui/dialog';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { useUpdatePayment } from '../query/update-payment';
import type { Payment, UpdatePaymentDto } from '../types/PaymentModel';

interface EditPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const EditPaymentModal: React.FC<EditPaymentModalProps> = ({
  isOpen,
  onClose,
  payment
}) => {
  const [formData, setFormData] = useState<UpdatePaymentDto>({
    fechaPagoEsperada: '',
    montoTotal: 0
  });

  const updatePaymentMutation = useUpdatePayment();

  useEffect(() => {
    if (payment) {
      // Handle montoTotal parsing more safely
      let parsedMonto = 0;
      if (typeof payment.montoTotal === 'string') {
        // Remove currency symbols, commas, and non-numeric characters except dots and minus
        const cleanedAmount = payment.montoTotal.replace(/[^\d.-]/g, '');
        parsedMonto = parseFloat(cleanedAmount) || 0;
      } else if (typeof payment.montoTotal === 'number') {
        parsedMonto = payment.montoTotal;
      }

      setFormData({
        fechaPagoEsperada: payment.fechaPagoEsperada?.split('T')[0] || '',
        montoTotal: parsedMonto
      });
    }
  }, [payment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment) return;

    // Validate form data
    if (!formData.montoTotal || formData.montoTotal <= 0) {
      toast.error('El monto total debe ser mayor a 0');
      return;
    }

    if (!formData.fechaPagoEsperada) {
      toast.error('La fecha de pago esperada es requerida');
      return;
    }

    try {
      // Ensure data types are correct before sending
      // Only send the fields that actually changed and are defined
      const updateData: UpdatePaymentDto = {};
      
      if (formData.montoTotal) {
        updateData.montoTotal = Number(formData.montoTotal);
      }
      
      if (formData.fechaPagoEsperada) {
        updateData.fechaPagoEsperada = formData.fechaPagoEsperada;
      }

      console.log('Sending update data:', updateData);

      await updatePaymentMutation.mutateAsync({
        id: payment.id,
        data: updateData
      });
      onClose();
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      fechaPagoEsperada: '',
      montoTotal: 0
    });
    onClose();
  };

  if (!payment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-800 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Editar Pago
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Payment Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Información del Pago</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p><span className="font-medium">Contrato:</span> {payment.contrato?.nombre || payment.contratoId}</p>
                <p><span className="font-medium">Estado:</span> {payment.estado}</p>
                <p><span className="font-medium">Monto Abonado:</span> {payment.montoAbonado}</p>
              </div>
            </div>

            {/* Edit Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="montoTotal" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Monto Total
                </Label>
                <Input
                  id="montoTotal"
                  type="number"
                  value={formData.montoTotal}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    montoTotal: parseFloat(e.target.value) || 0
                  }))}
                  placeholder="1000000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fechaPagoEsperada" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha de Pago Esperada
                </Label>
                <Input
                  id="fechaPagoEsperada"
                  type="date"
                  value={formData.fechaPagoEsperada}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    fechaPagoEsperada: e.target.value
                  }))}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updatePaymentMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={updatePaymentMutation.isPending}
            >
              {updatePaymentMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
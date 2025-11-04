import { ApiIntance } from "../../../../infrastructure/api";
import type { 
  Payment, 
  CreatePaymentDto, 
  UpdatePaymentDto, 
  PaymentAbonoDto,
  PaymentFilters,
  PaymentStats 
} from '../types/PaymentModel';

interface ErrorWithResponse {
  response?: {
    data?: unknown;
  };
}

const isErrorWithResponse = (error: unknown): error is ErrorWithResponse => {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const paymentService = {
  getAllPayments: async (filters?: PaymentFilters): Promise<Payment[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.estado) params.append('estado', filters.estado);
      if (filters?.contratoId) params.append('contratoId', filters.contratoId);
      if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde);
      if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta);
      
      const queryString = params.toString();
      const { data } = await ApiIntance.get<Payment[]>(`/pagos${queryString ? `?${queryString}` : ''}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPaymentById: async (id: string): Promise<Payment> => {
    try {
      const { data } = await ApiIntance.get<Payment>(`/pagos/${id}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPaymentsByContract: async (contratoId: string): Promise<Payment[]> => {
    try {
      const { data } = await ApiIntance.get<Payment[]>(`/pagos/contrato/${contratoId}`);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createPayment: async (paymentData: CreatePaymentDto): Promise<Payment> => {
    try {
      const { data } = await ApiIntance.post<Payment>(`/pagos`, paymentData);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updatePayment: async (id: string, updateData: UpdatePaymentDto): Promise<Payment> => {
    try {
      console.log('updatePayment - ID:', id);
      console.log('updatePayment - Data:', updateData);
      const { data } = await ApiIntance.patch<Payment>(`/pagos/${id}`, updateData);
      return data;
    } catch (error: unknown) {
      console.error('updatePayment error:', error);
      if (isErrorWithResponse(error)) {
        console.error('updatePayment error response:', error.response?.data);
      }
      throw error;
    }
  },

  addPaymentAbono: async (id: string, abonoData: PaymentAbonoDto): Promise<Payment> => {
    try {
      const { data } = await ApiIntance.patch<Payment>(`/pagos/${id}/abono`, abonoData);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deletePayment: async (id: string): Promise<void> => {
    try {
      await ApiIntance.delete(`/pagos/${id}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPaymentStats: async (): Promise<PaymentStats> => {
    const payments = await paymentService.getAllPayments();
    
    const stats: PaymentStats = {
      totalPagos: payments.length,
      montoTotalEsperado: '0',
      montoTotalRecaudado: '0',
      pagosPendientes: 0,
      pagosParciales: 0,
      pagosCompletados: 0,
      porcentajePagado: 0
    };

    if (payments.length === 0) return stats;

    let totalEsperado = 0;
    let totalRecaudado = 0;

    payments.forEach(payment => {
      const montoTotal = parseFloat(payment.montoTotal);
      const montoAbonado = parseFloat(payment.montoAbonado);
      
      totalEsperado += montoTotal;
      totalRecaudado += montoAbonado;

      switch (payment.estado) {
        case 'PENDIENTE':
          stats.pagosPendientes++;
          break;
        case 'PARCIAL':
          stats.pagosParciales++;
          break;
        case 'PAGADO':
          stats.pagosCompletados++;
          break;
        case 'VENCIDO':
          stats.pagosPendientes++; // Count expired as pending for stats
          break;
      }
    });

    stats.montoTotalEsperado = totalEsperado.toFixed(2);
    stats.montoTotalRecaudado = totalRecaudado.toFixed(2);
    stats.porcentajePagado = totalEsperado > 0 ? (totalRecaudado / totalEsperado) * 100 : 0;

    return stats;
  }
};

export const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const validateISODate = (date: string): boolean => {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj.toISOString().startsWith(date);
};

export const formatCurrency = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDIENTE':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PARCIAL':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'PAGADO':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'VENCIDO':
      return 'bg-red-100 text-red-900 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getPaymentStatusText = (status: string): string => {
  switch (status) {
    case 'PENDIENTE':
      return 'Pendiente';
    case 'PARCIAL':
      return 'Parcial';
    case 'PAGADO':
      return 'Pagado';
    case 'VENCIDO':
      return 'Vencido';
    default:
      return 'Desconocido';
  }
};
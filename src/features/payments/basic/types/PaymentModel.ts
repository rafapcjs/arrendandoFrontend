export type PaymentStatus = 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO';

export interface Tenant {
  id: string;
  nombres: string;
  apellidos: string;
  cedula?: string;
  telefono?: string;
  correo?: string;
}

export interface Property {
  id: string;
  direccion: string;
  ciudad?: string;
  tipo?: string;
  valorArriendo?: string;
}

export interface Contract {
  id: string;
  nombre?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  montoArriendo?: string;
  inquilinoId?: string;
  inmuebleId?: string;
  inquilino?: Tenant;
  inmueble?: Property;
}

export interface Payment {
  id: string;
  montoTotal: string;
  montoAbonado: string;
  estado: PaymentStatus;
  fechaPagoEsperada: string;
  fechaPagoReal: string | null;
  contratoId: string;
  contrato: Contract;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  montoTotal: number;
  fechaPagoEsperada: string;
  contratoId: string;
}

export interface UpdatePaymentDto {
  fechaPagoEsperada?: string;
  montoTotal?: number;
}

export interface PaymentAbonoDto {
  monto: number;
  fechaPago?: string;
}

export interface PaymentFilters {
  estado?: PaymentStatus;
  contratoId?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface PaymentStats {
  totalPagos: number;
  montoTotalEsperado: string;
  montoTotalRecaudado: string;
  pagosPendientes: number;
  pagosParciales: number;
  pagosCompletados: number;
  porcentajePagado: number;
}
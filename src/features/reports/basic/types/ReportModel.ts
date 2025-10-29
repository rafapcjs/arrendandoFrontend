export interface MonthlyIncomeReportDto {
    year: number;
    month: number;
    totalEsperado: number;
    totalPagado: number;
    totalPendiente: number;
    porcentajePagado: number;
    numeroPagosEsperados: number;
    numeroPagosCompletados: number;
}

export interface AnnualIncomeReportDto {
    year: number;
    totalEsperado: number;
    totalPagado: number;
    totalPendiente: number;
    porcentajePagado: number;
    reporteMensual: MonthlyIncomeReportDto[];
}

export interface EstadoDistribution {
    cantidad: number;
    monto: number;
    porcentaje: number;
}

export interface DistribucionPorEstado {
    pagado: EstadoDistribution;
    parcial: EstadoDistribution;
    pendiente: EstadoDistribution;
    vencido: EstadoDistribution;
}

export interface ComparisonReportDto {
    fechaInicio: string;
    fechaFin: string;
    totalEsperado: number;
    totalPagado: number;
    totalParcial: number;
    totalPendiente: number;
    totalVencido: number;
    porcentajePagadoVsEsperado: number;
    distribucionPorEstado: DistribucionPorEstado;
}

export interface MonthlyIncomeParams {
    year?: number;
    month?: number;
}

export interface AnnualIncomeParams {
    year?: number;
}

export interface ComparisonReportParams {
    fechaInicio?: string;
    fechaFin?: string;
}

export type EstadoPago = 'PAGADO' | 'PARCIAL' | 'PENDIENTE' | 'VENCIDO';
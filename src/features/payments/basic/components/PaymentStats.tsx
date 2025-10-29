import React from 'react';
import { Card } from '@/shared/components/ui/card';
import { DollarSign, Clock, CheckCircle, XCircle, TrendingUp, Percent } from 'lucide-react';
import { usePaymentStats } from '../query/payments';
import { formatCurrency } from '../service';

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(value);

export const PaymentStats: React.FC = () => {
  const { data: stats, isLoading, error } = usePaymentStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5 animate-pulse rounded-xl">
            <div className="h-4 bg-slate-200 rounded mb-3"></div>
            <div className="h-8 bg-slate-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="p-6">
        <p className="text-red-600">Error al cargar estadísticas de pagos</p>
      </Card>
    );
  }

  const statsCards = [
    {
      key: 'total-pagos',
      title: 'Total de Pagos',
      value: formatNumber(stats.totalPagos),
      icon: DollarSign,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      description: 'Registros de pagos procesados'
    },
    {
      key: 'monto-esperado',
      title: 'Monto Total Esperado',
      value: formatCurrency(stats.montoTotalEsperado),
      icon: TrendingUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      description: 'Suma de montos a cobrar'
    },
    {
      key: 'monto-recaudado',
      title: 'Monto Recaudado',
      value: formatCurrency(stats.montoTotalRecaudado),
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      description: 'Total efectivamente recibido'
    },
    {
      key: 'pagos-pendientes',
      title: 'Pagos Pendientes',
      value: formatNumber(stats.pagosPendientes),
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      description: 'Contratos con pagos pendientes'
    },
    {
      key: 'pagos-parciales',
      title: 'Pagos Parciales',
      value: formatNumber(stats.pagosParciales),
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      description: 'Pagos no completados'
    },
    {
      key: 'porcentaje-pagado',
      title: 'Porcentaje Pagado',
      value: `${stats.porcentajePagado.toFixed(1)}%`,
      icon: Percent,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      description: 'Proporción del monto cobrado'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.key}
            className="p-6 hover:shadow-lg transition-all duration-200 rounded-2xl border-0 bg-white"
            role="group"
            aria-labelledby={`${stat.key}-title`}
            title={stat.title}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p id={`${stat.key}-title`} className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <div className={`p-3 rounded-xl ${stat.color}`} aria-hidden="true">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div>
                <p 
                  className={`text-2xl font-bold ${stat.textColor} leading-tight break-words`} 
                  aria-live="polite"
                  style={{ wordBreak: 'break-word' }}
                >
                  {stat.value}
                </p>
                <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
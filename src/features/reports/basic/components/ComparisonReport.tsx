import { useState } from "react";
import { useComparisonReport } from "../query/comparison-report";
import { ReportCard } from "./ReportCard";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { DollarSign, TrendingUp, AlertCircle, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/shared/lib/formatCurrency";

export function ComparisonReport() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const [fechaInicio, setFechaInicio] = useState(`${currentYear}-01-01`);
  const [fechaFin, setFechaFin] = useState(`${currentYear}-12-31`);

  const { data: report, isLoading, error, refetch } = useComparisonReport({
    fechaInicio,
    fechaFin
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-red-600">Error al cargar el reporte comparativo</p>
          <Button onClick={() => refetch()} variant="outline">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Reporte Comparativo</h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1">
              <Label htmlFor="fechaInicio" className="text-sm font-medium">
                Fecha Inicio
              </Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="fechaFin" className="text-sm font-medium">
                Fecha Fin
              </Label>
              <Input
                id="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>
        </div>

        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <ReportCard
                title="Total Esperado"
                value={report.totalEsperado}
                icon={DollarSign}
                iconColor="text-blue-600"
                bgColor="bg-blue-100"
                format="currency"
              />
              
              <ReportCard
                title="Total Pagado"
                value={report.totalPagado}
                icon={CheckCircle2}
                iconColor="text-green-600"
                bgColor="bg-green-100"
                format="currency"
                percentage={report.porcentajePagadoVsEsperado}
              />
              
              <ReportCard
                title="Total Pendiente"
                value={report.totalPendiente}
                icon={Clock}
                iconColor="text-orange-600"
                bgColor="bg-orange-100"
                format="currency"
              />
              
              <ReportCard
                title="Total Parcial"
                value={report.totalParcial}
                icon={TrendingUp}
                iconColor="text-yellow-600"
                bgColor="bg-yellow-100"
                format="currency"
              />
              
              <ReportCard
                title="Total Vencido"
                value={report.totalVencido}
                icon={AlertCircle}
                iconColor="text-red-600"
                bgColor="bg-red-100"
                format="currency"
              />
              
              <ReportCard
                title="% Pagado vs Esperado"
                value={report.porcentajePagadoVsEsperado}
                icon={BarChart3}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                format="percentage"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Distribución por Estado de Pago
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(report.distribucionPorEstado).map(([estado, data]) => {
                    const getEstadoConfig = (estado: string) => {
                      switch (estado) {
                        case 'pagado':
                          return { color: 'text-green-600', bg: 'bg-green-50', label: 'Pagado' };
                        case 'parcial':
                          return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Parcial' };
                        case 'pendiente':
                          return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Pendiente' };
                        case 'vencido':
                          return { color: 'text-red-600', bg: 'bg-red-50', label: 'Vencido' };
                        default:
                          return { color: 'text-gray-600', bg: 'bg-gray-50', label: estado };
                      }
                    };

                    const config = getEstadoConfig(estado);

                    return (
                      <div key={estado} className={`p-4 rounded-lg ${config.bg} border`}>
                        <div className="flex items-center justify-between">
                          <h4 className={`font-semibold ${config.color} capitalize`}>
                            {config.label}
                          </h4>
                          <span className={`text-sm font-medium ${config.color}`}>
                            {data.porcentaje.toFixed(2)}%
                          </span>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-slate-600">
                            Cantidad: <span className="font-medium">{data.cantidad}</span>
                          </p>
                          <p className="text-sm text-slate-600">
                            Monto: <span className="font-medium">{formatCurrency(data.monto)}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-3">Resumen del Período</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-slate-600">Desde:</span>
                        <span className="font-medium">{new Date(report.fechaInicio).toLocaleDateString('es-CO')}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-600">Hasta:</span>
                        <span className="font-medium">{new Date(report.fechaFin).toLocaleDateString('es-CO')}</span>
                      </p>
                      <hr className="my-2" />
                      <p className="flex justify-between">
                        <span className="text-slate-600">Total Pagos:</span>
                        <span className="font-medium">
                          {Object.values(report.distribucionPorEstado).reduce((acc, curr) => acc + curr.cantidad, 0)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-slate-600">Efectividad:</span>
                        <span className={`font-medium ${
                          report.porcentajePagadoVsEsperado >= 90 ? 'text-green-600' :
                          report.porcentajePagadoVsEsperado >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {report.porcentajePagadoVsEsperado >= 90 ? 'Excelente' :
                           report.porcentajePagadoVsEsperado >= 70 ? 'Buena' : 'Necesita Mejora'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </Card>
    </div>
  );
}
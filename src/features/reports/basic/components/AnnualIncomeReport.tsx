import { useState } from "react";
import { useAnnualIncomeReport } from "../query/annual-income";
import { ReportCard } from "./ReportCard";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";
import { DollarSign, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/shared/lib/formatCurrency";

export function AnnualIncomeReport() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const { data: report, isLoading, error, refetch } = useAnnualIncomeReport({
    year: selectedYear
  });

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
          <p className="text-red-600">Error al cargar el reporte anual</p>
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
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Reporte Anual de Ingresos</h2>
          
          <Select
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>

        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                icon={TrendingUp}
                iconColor="text-green-600"
                bgColor="bg-green-100"
                format="currency"
                percentage={report.porcentajePagado}
              />
              
              <ReportCard
                title="Total Pendiente"
                value={report.totalPendiente}
                icon={Calendar}
                iconColor="text-orange-600"
                bgColor="bg-orange-100"
                format="currency"
              />
              
              <ReportCard
                title="Porcentaje Pagado"
                value={report.porcentajePagado}
                icon={BarChart3}
                iconColor="text-purple-600"
                bgColor="bg-purple-100"
                format="percentage"
              />
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Desglose Mensual</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-medium text-slate-600">Mes</th>
                      <th className="text-right py-2 font-medium text-slate-600">Esperado</th>
                      <th className="text-right py-2 font-medium text-slate-600">Pagado</th>
                      <th className="text-right py-2 font-medium text-slate-600">Pendiente</th>
                      <th className="text-right py-2 font-medium text-slate-600">% Pagado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.reporteMensual.map((monthReport, index) => (
                      <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-900">
                          {months[monthReport.month - 1]}
                        </td>
                        <td className="text-right py-3 text-slate-700">
                          {formatCurrency(monthReport.totalEsperado)}
                        </td>
                        <td className="text-right py-3 text-green-600 font-medium">
                          {formatCurrency(monthReport.totalPagado)}
                        </td>
                        <td className="text-right py-3 text-orange-600">
                          {formatCurrency(monthReport.totalPendiente)}
                        </td>
                        <td className="text-right py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            monthReport.porcentajePagado >= 90 
                              ? 'bg-green-100 text-green-800'
                              : monthReport.porcentajePagado >= 70
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {monthReport.porcentajePagado.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </Card>
    </div>
  );
}
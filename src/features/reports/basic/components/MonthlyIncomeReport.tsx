import { useState } from "react";
import { useMonthlyIncomeReport } from "../query/monthly-income";
import { ReportCard } from "./ReportCard";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";
import { DollarSign, TrendingUp, Calendar, CheckCircle } from "lucide-react";

export function MonthlyIncomeReport() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);

  const { data: report, isLoading, error, refetch } = useMonthlyIncomeReport({
    year: selectedYear,
    month: selectedMonth
  });

  const months = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

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
          <p className="text-red-600">Error al cargar el reporte mensual</p>
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
          <h2 className="text-2xl font-bold text-slate-900">Reporte Mensual de Ingresos</h2>
          
          <div className="flex gap-3">
            <Select
              value={selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
            
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
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              icon={CheckCircle}
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
              title="Pagos Completados"
              value={report.numeroPagosCompletados}
              icon={TrendingUp}
              iconColor="text-purple-600"
              bgColor="bg-purple-100"
              format="number"
              subtitle={`de ${report.numeroPagosEsperados}`}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
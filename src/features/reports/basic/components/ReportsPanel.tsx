import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MonthlyIncomeReport } from "./MonthlyIncomeReport";
import { AnnualIncomeReport } from "./AnnualIncomeReport";
import { ComparisonReport } from "./ComparisonReport";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";

type ReportTab = "monthly" | "annual" | "comparison";

export function ReportsPanel() {
  const [activeTab, setActiveTab] = useState<ReportTab>("monthly");

  const tabs = [
    {
      id: "monthly" as ReportTab,
      label: "Reporte Mensual",
      icon: Calendar,
      description: "Ingresos del mes actual"
    },
    {
      id: "annual" as ReportTab,
      label: "Reporte Anual",
      icon: BarChart3,
      description: "Resumen anual completo"
    },
    {
      id: "comparison" as ReportTab,
      label: "Reporte Comparativo",
      icon: TrendingUp,
      description: "Análisis por período"
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "monthly":
        return <MonthlyIncomeReport />;
      case "annual":
        return <AnnualIncomeReport />;
      case "comparison":
        return <ComparisonReport />;
      default:
        return <MonthlyIncomeReport />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Reportes de Ingresos</h1>
            <p className="text-slate-600 mt-1">
              Analiza el rendimiento financiero de tu negocio
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 justify-start sm:justify-center"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[1]}</span>
              </Button>
            );
          })}
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </Card>

      {renderContent()}
    </div>
  );
}
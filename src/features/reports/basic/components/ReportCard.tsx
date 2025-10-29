import { Card } from "@/shared/components/ui/card";
import { formatCurrency } from "@/shared/lib/formatCurrency";
import type { LucideIcon } from "lucide-react";

interface ReportCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  percentage?: number;
  subtitle?: string;
  format?: "currency" | "number" | "percentage";
}

export function ReportCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  percentage,
  subtitle,
  format = "currency"
}: ReportCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return formatCurrency(val);
      case "percentage":
        return `${val.toFixed(2)}%`;
      case "number":
      default:
        return val.toLocaleString('es-CO');
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
          </div>
          
          {percentage !== undefined && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
              <span>{percentage.toFixed(2)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 leading-tight group-hover:text-slate-700 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              {formatValue(value)}
            </p>
            {subtitle && (
              <span className="text-sm text-slate-500 font-medium">{subtitle}</span>
            )}
          </div>
        </div>
      </div>

      <div className={`h-1 ${bgColor.replace('bg-', 'bg-gradient-to-r from-')} to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
    </Card>
  );
}
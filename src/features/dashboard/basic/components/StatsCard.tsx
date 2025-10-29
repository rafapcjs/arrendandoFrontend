import { Card } from "@/shared/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  subtitle?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  description,
  trend,
  trendValue,
  subtitle 
}: StatsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "neutral":
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      case "neutral":
        return "text-gray-600 bg-gray-50";
      default:
        return "";
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} />
          </div>
          
          {/* Trend indicator */}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 leading-tight group-hover:text-slate-700 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
              {value}
            </p>
            {subtitle && (
              <span className="text-sm text-slate-500 font-medium">{subtitle}</span>
            )}
          </div>

          {description && (
            <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className={`h-1 ${bgColor.replace('bg-', 'bg-gradient-to-r from-')} to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
    </Card>
  );
}
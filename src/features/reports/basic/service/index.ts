import { ApiIntance } from "../../../../infrastructure/api";
import type { 
    MonthlyIncomeReportDto,
    AnnualIncomeReportDto,
    ComparisonReportDto,
    MonthlyIncomeParams,
    AnnualIncomeParams,
    ComparisonReportParams
} from "../types/ReportModel";

export const getMonthlyIncomeReport = async (params?: MonthlyIncomeParams): Promise<MonthlyIncomeReportDto> => {
    try {
        const searchParams = new URLSearchParams();
        if (params?.year) searchParams.append('year', params.year.toString());
        if (params?.month) searchParams.append('month', params.month.toString());
        
        const { data } = await ApiIntance.get<MonthlyIncomeReportDto>(`/reports/income/monthly?${searchParams.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getAnnualIncomeReport = async (params?: AnnualIncomeParams): Promise<AnnualIncomeReportDto> => {
    try {
        const searchParams = new URLSearchParams();
        if (params?.year) searchParams.append('year', params.year.toString());
        
        const { data } = await ApiIntance.get<AnnualIncomeReportDto>(`/reports/income/annual?${searchParams.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getComparisonReport = async (params?: ComparisonReportParams): Promise<ComparisonReportDto> => {
    try {
        const searchParams = new URLSearchParams();
        if (params?.fechaInicio) searchParams.append('fechaInicio', params.fechaInicio);
        if (params?.fechaFin) searchParams.append('fechaFin', params.fechaFin);
        
        const { data } = await ApiIntance.get<ComparisonReportDto>(`/reports/income/comparison?${searchParams.toString()}`);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
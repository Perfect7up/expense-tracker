import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export interface OverviewData {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  activeSubscriptions: number;
  totalInvested?: number;
  currentValue?: number;
  profitLoss?: number;
}

export interface CashflowData {
  from?: string;
  to?: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export interface CategoryData {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface InvestmentData {
  id: string;
  name: string;
  quantity: number;
  investedAmount: number;
  currentValue: number;
  profitLoss: number;
}

export const useReportsData = () => {
  const overviewQuery = useQuery<OverviewData>({
    queryKey: ['reports', 'overview'],
    queryFn: async () => {
      const res = await fetch('/api/reports/overview');
      return res.json();
    },
  });

  const cashflowQuery = useQuery<CashflowData>({
    queryKey: ['reports', 'cashflow'],
    queryFn: async () => {
      const res = await fetch('/api/reports/cashflow');
      return res.json();
    },
  });

  const categoriesQuery = useQuery<CategoryData[]>({
    queryKey: ['reports', 'categories'],
    queryFn: async () => {
      const res = await fetch('/api/reports/categories');
      return res.json();
    },
  });

  const investmentsQuery = useQuery<InvestmentData[]>({
    queryKey: ['reports', 'investments'],
    queryFn: async () => {
      const res = await fetch('/api/reports/investments');
      return res.json();
    },
  });

  return {
    overview: overviewQuery.data,
    cashflow: cashflowQuery.data,
    categoryBreakdown: categoriesQuery.data || [],
    investments: investmentsQuery.data || [],
    isLoading: overviewQuery.isLoading || cashflowQuery.isLoading || 
               categoriesQuery.isLoading || investmentsQuery.isLoading,
    refetch: () => {
      overviewQuery.refetch();
      cashflowQuery.refetch();
      categoriesQuery.refetch();
      investmentsQuery.refetch();
    },
  };
};

export const useExportReports = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAll = async (exportFormat: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      await handleExport('expenses', exportFormat);
      await new Promise(resolve => setTimeout(resolve, 500));
      await handleExport('incomes', exportFormat);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async (type: string, exportFormat: 'csv' | 'json') => {
    const params = new URLSearchParams({ type, format: exportFormat });
    const res = await fetch(`/api/reports/download?${params}`);
    
    if (!res.ok) {
      throw new Error('Export failed');
    }

    if (exportFormat === 'csv') {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return { handleExportAll, handleExport, isExporting };
};
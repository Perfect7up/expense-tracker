import { create } from "zustand";
import { KpiData } from "../types/types";

interface DashboardState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  kpiData: KpiData | null;
  setKpiData: (data: KpiData) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
  kpiData: null,
  setKpiData: (data) => set({ kpiData: data }),
}));

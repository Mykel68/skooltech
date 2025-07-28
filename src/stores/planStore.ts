import { create } from "zustand";

interface PlanStore {
  currentPlan: string;
  studentCount: number;
  studentLimit: number;
  trialDaysLeft: number;
  startDate: string;
  endDate: string;

  // Actions
  setPlanData: (
    data: Partial<Omit<PlanStore, "setPlanData" | "clearPlanData">>
  ) => void;
  clearPlanData: () => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  currentPlan: "",
  studentCount: 0,
  studentLimit: 0,
  trialDaysLeft: 0,
  startDate: "",
  endDate: "",

  setPlanData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  clearPlanData: () =>
    set({
      currentPlan: "",
      studentCount: 0,
      studentLimit: 0,
      trialDaysLeft: 0,
      startDate: "",
      endDate: "",
    }),
}));

import { api } from "@/lib/api-client";
import { CampaignHistory } from "./outreach.service";

export interface DashboardResponse {
  success: boolean;
  campaigns: CampaignHistory[];
  dashboard: {
    consultations: {
      total_consultations: number;
      pending_consultations: number;
      confirmed_consultations: number;
      completed_consultations: number;
      cancelled_consultations: number;
    };
    clients: {
      total_clients: number;
    };
    careers: {
      total_applications: number;
      new_applications: number;
    };
    enquiries: {
      total_enquiries: number;
      new_enquiries: number;
    };
  };
}

export const DashboardService = {
  getStats: async (): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>("/api/admin/stats");
    return response.data;
  },
};

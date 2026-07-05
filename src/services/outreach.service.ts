import { api } from "@/lib/api-client";

export interface CampaignHistory {
  id?: string;
  _id?: string;
  name: string;
  uploadDate: string;
  totalRecipients: number;
  sent: number;
  pending: number;
  failed: number;
  status?: string;
}

export interface DeliveryStatus {
  id?: string;
  _id?: string;
  clientName: string;
  phone: string;
  reminderType: string;
  status: "Pending" | "Sent" | "Delivered" | "Failed";
  sentTime?: string;
  deliveredTime?: string;
}

export const OutreachService = {
  uploadCampaign: async (file: File): Promise<{ message: string; campaignId: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/admin/outreach/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getCampaignHistory: async (): Promise<CampaignHistory[]> => {
    // According to the prompt, Campaign history comes from GET /api/admin/stats
    const response = await api.get("/api/admin/stats");
    return response.data?.campaigns || [];
  },

  getDeliveryStatus: async (campaignId?: string): Promise<DeliveryStatus[]> => {
    const endpoint = campaignId 
      ? `/api/admin/outreach/delivery?campaignId=${campaignId}`
      : `/api/admin/outreach/delivery`;
    const response = await api.get(endpoint);
    return response.data?.delivery || response.data || [];
  }
};

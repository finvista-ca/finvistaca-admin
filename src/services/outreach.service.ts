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
    // Pointing directly to the dedicated history route we built
    const response = await api.get("/api/admin/outreach/history");
    return Array.isArray(response.data) ? response.data : response.data?.campaigns || [];
  },

  getDeliveryStatus: async (campaignId?: string): Promise<DeliveryStatus[]> => {
    // If no campaign is selected yet, return an empty array immediately without making a failing request
    if (!campaignId) {
      return [];
    }

    const response = await api.get(`/api/admin/outreach/delivery?campaignId=${campaignId}`);
    return Array.isArray(response.data) ? response.data : response.data?.rows || [];
  }
};
import { api } from "@/lib/api-client";

export interface Consultation {
  id?: string;
  _id?: string;
  clientName: string;
  email?: string;
  phone: string;
  branch: string;
  service: string;
  message?: string;
  date: string;
  time: string;
  bookedOn?: string;
  createdAt?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export const ConsultationService = {
  getAll: async (): Promise<Consultation[]> => {
    try {
      const response = await api.get("/api/admin/consultations");
      const data = response.data;
      
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.bookings)) {
        return data.bookings;
      }
      if (data && Array.isArray(data.consultations)) {
        return data.consultations;
      }
      return [];
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Bookings API not implemented yet, returning empty array.");
        return [];
      }
      throw error;
    }
  },

  updateStatus: async (id: string, status: Consultation["status"]): Promise<void> => {
    // The prompt says PATCH /api/admin/consultations
    await api.patch("/api/admin/consultations", { id, status });
  }
};

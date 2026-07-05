import { api } from "@/lib/api-client";

export interface Consultation {
  id?: string;
  _id?: string;
  clientName: string;
  phone: string;
  branch: string;
  service: string;
  message?: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

export const ConsultationService = {
  getAll: async (): Promise<Consultation[]> => {
    const response = await api.get("/api/admin/bookings");
    // Depending on backend shape, it might be { success: true, bookings: [...] } or just [...]
    return response.data?.bookings || response.data || [];
  },

  updateStatus: async (id: string, status: Consultation["status"]): Promise<void> => {
    // The prompt says PATCH /api/admin/bookings
    await api.patch("/api/admin/bookings", { id, status });
  }
};

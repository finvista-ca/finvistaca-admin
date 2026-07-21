import { api } from "@/lib/api-client";

export const AuthService = {
  login: async (password: string): Promise<boolean> => {
    try {
      const response = await api.post("/api/admin/login", { password });
      if (response.data?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("finvista_admin_token", response.data.token);
        }
        return true;
      }
      return false;
    } catch (error: any) {
      if (error?.response?.status === 401 || error?.response?.status === 400) {
        return false;
      }
      console.error("Login failed:", error instanceof Error ? error.message : error);
      throw error;
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("finvista_admin_token");
      window.location.href = "/login";
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("finvista_admin_token");
    }
    return false;
  }
};

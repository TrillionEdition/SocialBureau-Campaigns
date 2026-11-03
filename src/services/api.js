import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.socialbureau.in",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let csrfToken = "";

export function setApiCsrfToken(token) {
  csrfToken = typeof token === "string" ? token : "";
}

api.interceptors.request.use((config) => {
  if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
  return config;
});

export const workspaceApi = {
  adminClients: (params) => api.get("/clients", { params }),
  adminClient: (id) => api.get(`/clients/${encodeURIComponent(id)}`),
  adminCampaigns: (params) => api.get("/campaigns/admin", { params }),
  clientCampaigns: () => api.get("/campaigns/mine"),
  clientCampaign: (bookingId) => api.get(`/campaigns/${encodeURIComponent(bookingId)}`),
  campaignAnalytics: (campaignId) => api.get(`/campaigns/${encodeURIComponent(campaignId)}/analytics`),
  adminPlans: () => api.get("/campaigns/admin/plans"),
  activeCampaignPlans: () => api.get("/campaigns/pricing"),
  adminSubscriptions: (params) => api.get("/api/client-subscriptions/admin", { params }),
  clientSubscription: () => api.get("/api/client-subscriptions/me"),
  adminClientUsers: () => api.get("/api/client-subscriptions/admin/clients"),
};

export default api;

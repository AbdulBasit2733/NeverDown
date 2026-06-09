import { api } from "./api";

export interface WebsiteTick {
  id: string;
  response_time_ms: number;
  status: "up" | "Down" | "Unknown";
  createdAt: string;
}

export interface Website {
  id: string;
  url: string;
  ticks: WebsiteTick[];
}

export interface WebsiteDisplay extends Website {
  status: "up" | "down" | "checking";
  responseTime: string;
  lastChecked: string;
}

export const websiteService = {
  async getAll(): Promise<Website[]> {
    const { data } = await api.get("/websites");
    return data.data;
  },

  async add(url: string): Promise<void> {
    await api.post("/websites/add", { url });
  },

  async getStatus(websiteId: string) {
    const { data } = await api.get(`/status/${websiteId}`);
    return data.data;
  },

  transformWebsite(website: Website): WebsiteDisplay {
    const latest = website.ticks?.[0];

    if (!latest) {
      return {
        ...website,
        status: "checking",
        responseTime: "N/A",
        lastChecked: "Never",
      };
    }

    return {
      ...website,
      status:
        latest.status === "up"
          ? "up"
          : latest.status === "Down"
            ? "down"
            : "checking",
      responseTime: `${latest.response_time_ms} ms`,
      lastChecked: new Date(latest.createdAt).toLocaleString(),
    };
  },
};

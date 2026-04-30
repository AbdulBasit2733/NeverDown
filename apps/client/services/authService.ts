import { api } from "./api";

export interface AuthUser {
  id: string;
  username: string;
}

export const authService = {
  async register(username: string, password: string): Promise<void> {
    await api.post("/signup", { username, password });
  },

  async login(username: string, password: string): Promise<AuthUser> {
    const { data } = await api.post("/signin", { username, password });
    return { id: data.userId, username: data.username };
  },

  async refresh(): Promise<AuthUser | null> {
    try {
      const { data } = await api.post("/auth/refresh");
      return { id: data.userId, username: data.username };
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      return;
    }
  },
};
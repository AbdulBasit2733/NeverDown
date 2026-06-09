import { api } from "./api";

export const authService = {
  async register(username: string, password: string): Promise<void> {
    await api.post("/signup", { username, password });
  },
};

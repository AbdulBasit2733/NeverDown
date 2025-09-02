import axios from "axios";
import { describe, expect, it } from "bun:test";
import { BACKEND_URL } from "./config";

const USER_NAME = "user_" + Math.random().toString(36).substring(2, 10);
const PASSWORD = "testpassword";

describe("Auth Endpoints", () => {
  describe("Signup", () => {
    it("should fail if body is incorrect", async () => {
      try {
        await axios.post(`${BACKEND_URL}/user/signup`, {
          username: USER_NAME,
          // missing password
        });
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response?.status).toBe(400); // Bad request
      }
    });

    it("should signup successfully with valid data", async () => {
      const res = await axios.post(`${BACKEND_URL}/user/signup`, {
        username: USER_NAME,
        password: PASSWORD,
      });
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
    });

    it("should not allow duplicate signup", async () => {
      try {
        await axios.post(`${BACKEND_URL}/user/signup`, {
          username: USER_NAME,
          password: PASSWORD,
        });
        throw new Error("Duplicate signup should have failed");
      } catch (error: any) {
        expect([400, 409]).toContain(error.response?.status); // depends on backend
      }
    });
  });

  describe("Signin", () => {
    it("should fail if body is incorrect", async () => {
      try {
        await axios.post(`${BACKEND_URL}/user/signin`, {
          username: USER_NAME,
          // missing password
        });
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response?.status).toBe(400); // Bad request
      }
    });

    it("should fail with wrong credentials", async () => {
      try {
        await axios.post(`${BACKEND_URL}/user/signin`, {
          username: USER_NAME,
          password: "wrongpassword",
        });
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect([401, 403]).toContain(error.response?.status); // Unauthorized/Forbidden
      }
    });

    it("should signin successfully with correct credentials", async () => {
      const res = await axios.post(`${BACKEND_URL}/user/signin`, {
        username: USER_NAME,
        password: PASSWORD,
      });
      expect(res.status).toBe(200);
      expect(res.data.success).toBe(true);
      expect(res.headers["set-cookie"]).toBeDefined(); // token cookie set
    });
  });
});

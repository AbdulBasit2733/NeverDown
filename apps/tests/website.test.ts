import { describe, expect, it } from "bun:test";
import axios from "axios";
//supertest

let BASE_URL = "http://localhost:3001";
describe("Websites gets created", () => {
  it("website not created if url is not present", async () => {
    try {
      axios.post(`${BASE_URL}/website`, {});
      expect(false, "Website created when it should not");
    } catch (error) {}
  });
  it("Website is created if url is present", async () => {
    const response = await axios.post(`${BASE_URL}/website`, {
      url: "https://google.com",
    });
    expect(response.data.id).not.toBeNull();
  });
});

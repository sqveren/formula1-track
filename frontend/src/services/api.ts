import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
});

export async function testApiConnection(): Promise<boolean> {
  const response = await apiClient.get("/docs");
  return response.status === 200;
}

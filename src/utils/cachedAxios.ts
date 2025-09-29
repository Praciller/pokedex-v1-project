import axios, { AxiosResponse } from "axios";
import { apiCache } from "./apiCache";

// Cached axios wrapper for GET requests
export const cachedAxios = {
  async get<T = any>(url: string, ttl?: number): Promise<AxiosResponse<T>> {
    // Check cache first
    const cachedResponse = apiCache.get(url);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      // Make the actual request
      const response = await axios.get<T>(url);

      // Cache the response (default TTL: 5 minutes for Pokemon data)
      apiCache.set(url, response, ttl || 5 * 60 * 1000);

      return response;
    } catch (error) {
      throw error;
    }
  },

  // For non-GET requests, just use regular axios
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch,
};

export default cachedAxios;

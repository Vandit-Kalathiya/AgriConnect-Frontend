import { API_CONFIG } from "../config/apiConfig";
import api from "../config/axiosInstance";

const AI_BASE_PATH = `${API_CONFIG.MARKET_ACCESS}/api/v1/ai`;
const DEFAULT_TIMEOUT_MS = 30000;

const isFormData = (value) => typeof FormData !== "undefined" && value instanceof FormData;

const normalizeAxiosError = (error) => {
  const status = error?.response?.status ?? 0;
  const body = error?.response?.data;
  const details =
    (typeof body === "string" && body) ||
    body?.message ||
    body?.error ||
    error?.message ||
    "Unknown error";
  const errorCode = body?.code || "";

  const message = `AI API request failed (${status})${details ? `: ${details}` : ""}`;
  const error = new Error(message);
  error.status = status;
  error.code = errorCode;
  return error;
};

export const postAi = async (endpoint, body, options = {}) => {
  const { headers = {}, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const url = `${AI_BASE_PATH}${endpoint}`;
  try {
    const response = await api.post(url, body, {
      withCredentials: true,
      headers: isFormData(body)
        ? headers
        : {
            "Content-Type": "application/json",
            ...headers,
          },
      signal,
      timeout: timeoutMs,
    });
    return response.data;
  } catch (error) {
    const isTimeout = error?.code === "ECONNABORTED";
    if (isTimeout) {
      const wrapped = new Error("AI API request timed out. Please try again.");
      wrapped.status = 408;
      throw wrapped;
    }
    throw normalizeAxiosError(error);
  }
};

export const AI_API_BASE_PATH = AI_BASE_PATH;

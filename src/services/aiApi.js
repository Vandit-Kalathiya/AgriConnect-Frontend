import { API_CONFIG } from "../config/apiConfig";

const AI_BASE_PATH = `${API_CONFIG.MARKET_ACCESS}/api/v1/ai`;
const DEFAULT_TIMEOUT_MS = 30000;

const isFormData = (value) => typeof FormData !== "undefined" && value instanceof FormData;

const buildHeaders = (body, headers = {}) => {
  if (isFormData(body)) {
    return headers;
  }

  return {
    "Content-Type": "application/json",
    "Credentials": "include",
    ...headers,
  };
};

const normalizeError = async (response) => {
  let details = "";
  let errorCode = "";
  try {
    const payload = await response.json();
    details = payload?.message || payload?.error || JSON.stringify(payload);
    errorCode = payload?.code || "";
  } catch {
    details = response.statusText;
  }

  const message = `AI API request failed (${response.status})${details ? `: ${details}` : ""}`;
  const error = new Error(message);
  error.status = response.status;
  error.code = errorCode;
  return error;
};

export const postAi = async (endpoint, body, options = {}) => {
  const { headers = {}, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const url = `${AI_BASE_PATH}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const activeSignal = signal || controller.signal;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders(body, headers),
      body: isFormData(body) ? body : JSON.stringify(body),
      signal: activeSignal,
    });
  } catch (error) {
    const isAbort = error?.name === "AbortError";
    const wrapped = new Error(
      isAbort ? "AI API request timed out. Please try again." : "AI API request failed due to network error."
    );
    wrapped.status = isAbort ? 408 : 0;
    throw wrapped;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    throw await normalizeError(response);
  }

  return response.json();
};

export const AI_API_BASE_PATH = AI_BASE_PATH;

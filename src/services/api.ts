/**
 * Base API client for the Silver Refinery backend.
 *
 * Uses the native fetch API (no Axios dependency needed).
 * Handles JWT tokens, consistent error parsing, and 401 redirects.
 */

function isLocalNetworkIp(hostname: string): boolean {
  return (
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  );
}

function getApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_URL as string) || '';
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location) {
    const { hostname } = window.location;
    // Local network Wi-Fi device access (e.g. mobile phone connecting to laptop)
    if (isLocalNetworkIp(hostname)) {
      return `http://${hostname}:5000`;
    }
    // Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    // Cloud / Vercel hosted environment (use same-origin relative API path)
    return '';
  }

  return 'http://localhost:5000';
}

const API_BASE_URL = getApiBaseUrl();

// ========================
// Token Management
// ========================

const TOKEN_KEY = 'sba_auth_token';
const PERSIST_AUTH_KEY = 'sba_authenticated';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PERSIST_AUTH_KEY, 'true');
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PERSIST_AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken() || localStorage.getItem(PERSIST_AUTH_KEY) === 'true';
}

// ========================
// API Response Types
// ========================

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: unknown;

  constructor(code: string, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// ========================
// Core Fetch Wrapper
// ========================

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  noAuth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, noAuth, headers: customHeaders, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  // Add auth token unless explicitly skipped
  if (!noAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add Content-Type for JSON bodies (not for FormData)
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 — redirect to login (only for protected endpoints, not for login failures)
  if (response.status === 401) {
    if (!endpoint.includes('/auth/login')) {
      clearToken();
      window.dispatchEvent(new CustomEvent('auth:logout'));
      throw new ApiError('UNAUTHORIZED', 'Session expired. Please log in again.', 401);
    }
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (!json.success) {
    const errorData = json as ApiErrorResponse;
    throw new ApiError(
      errorData.error.code,
      errorData.error.message,
      response.status,
      errorData.error.details
    );
  }

  // For responses with meta (like pagination), attach it
  const successData = json as ApiSuccessResponse<T>;
  if (successData.meta) {
    (successData.data as Record<string, unknown>).__meta = successData.meta;
  }

  return successData.data;
}

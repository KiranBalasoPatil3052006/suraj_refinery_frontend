import { apiFetch, setToken, clearToken } from './api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Login with email and password.
 * Stores the JWT token on success.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const result = await apiFetch<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: { email, password },
    noAuth: true,
  });

  // Store the token
  setToken(result.token);

  return result;
}

/**
 * Get the current user's profile.
 */
export async function getProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>('/api/v1/auth/me');
}

/**
 * Logout: clear the stored token.
 */
export function logout(): void {
  clearToken();
  window.dispatchEvent(new CustomEvent('auth:logout'));
}

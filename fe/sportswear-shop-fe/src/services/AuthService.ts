import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/login";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CURRENT_USER_KEY = "currentUser";

export interface AuthResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: string;
  fullName: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  address: string;
}

export const login = async (
  usernameOrEmail: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL, {
    usernameOrEmail,
    password,
  });

  if (response.status === 200 && response.data?.token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.token);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({
        username: response.data.username,
        role: response.data.role,
        fullName: response.data.fullName,
      }),
    );
  }

  return response.data;
};

export const register = async (payload: RegisterRequest): Promise<void> => {
  await axios.post("http://localhost:8080/api/v1/auth/register", payload);
};

export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getCurrentUser = (): {
  username: string;
  role: string;
  fullName: string;
} | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

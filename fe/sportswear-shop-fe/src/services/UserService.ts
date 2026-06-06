import axios from "axios";
import { getAccessToken } from "./AuthService";

const USERS_API_URL = "http://localhost:8080/api/v1/users";

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone: string;
  address: string;
  roleId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Không có token đăng nhập.");
  }

  const response = await axios.get<UserProfile>(`${USERS_API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

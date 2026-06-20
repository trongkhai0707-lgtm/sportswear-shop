import axiosInstance from "./axiosInstance";

const USERS_API_URL = "/api/v1/users";

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
  const response = await axiosInstance.get<UserProfile>(
    `${USERS_API_URL}/profile`,
  );
  return response.data;
};

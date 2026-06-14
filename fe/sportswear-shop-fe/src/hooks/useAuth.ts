import { getCurrentUser } from "../services/AuthService";

export function useAuth() {
  const user = getCurrentUser();

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ROLE_ADMIN",
  };
}

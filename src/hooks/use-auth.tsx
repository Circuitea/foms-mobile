import { useAuth } from "@/providers/auth-provider";

// Re-export from provider for convenience
export { useAuth } from "@/providers/auth-provider";

// Additional auth-related hooks can be added here
export function useUser() {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

export function useAuthLoading() {
  const { isLoading } = useAuth();
  return isLoading;
}
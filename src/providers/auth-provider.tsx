import api from "@/lib/api";
import { STORE_API_TOKEN_KEY, STORE_EXPO_PUSH_TOKEN_KEY } from "@/lib/constants";
import { Status, User } from "@/types";
import * as Device from "expo-device";
import { router } from "expo-router";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstTimeLogin: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  completeFirstTimeLogin: (password: string, passwordConfirmation: string) => Promise<void>;
}

interface ProfileContextType {
  profile: User | null;
  dispatch: React.Dispatch<ProfileAction>;
}

interface LoginResult {
  success: boolean;
  isFirstTimeLogin?: boolean;
  errors?: { email?: string[]; password?: string[] };
}

// Profile Actions (keeping compatibility with existing code)
type ProfileAction = SetProfileAction | RemoveProfileAction | UpdateStatusAction | UpdateFirstTimeLoginAction;

interface SetProfileAction {
  type: "set";
  user: User;
}

interface UpdateStatusAction {
  type: "updateStatus";
  status: Status;
}

interface UpdateFirstTimeLoginAction {
  type: "updateFirstTimeLogin";
  first_time_login: boolean;
}

interface RemoveProfileAction {
  type: "remove";
}

function profileReducer(profile: User | null, action: ProfileAction): User | null {
  switch (action.type) {
    case "set":
      return action.user;
    case "updateStatus":
      if (!profile) return null;
      return {
        ...profile,
        status: action.status,
      };
    case "updateFirstTimeLogin":
      if (!profile) return null;
      return {
        ...profile,
        first_time_login: action.first_time_login,
      };
    case "remove":
      return null;
    default:
      return profile;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);
const ProfileContext = createContext<User | null>(null);
const ProfileDispatchContext = createContext<React.Dispatch<ProfileAction> | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [profile, dispatch] = useReducer(profileReducer, null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

  const isAuthenticated = !!token && !!profile;
  const isFirstTimeLogin = !!profile?.first_time_login;

  // Initialize auth state from secure storage
  useEffect(() => {
    async function loadAuthState() {
      try {
        const storedToken = await getItemAsync(STORE_API_TOKEN_KEY);

        if (storedToken) {
          setToken(storedToken);

          // Validate token by fetching user profile
          const response = await api.get("/user");
          dispatch({ type: "set", user: response.data });

          // Set pending redirect instead of navigating immediately
          if (response.data.first_time_login) {
            setPendingRedirect("/(auth)/onboarding");
          }
        }
      } catch (error) {
        // Token invalid or expired, clear it
        await deleteItemAsync(STORE_API_TOKEN_KEY);
        setToken(null);
        dispatch({ type: "remove" });
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthState();
  }, []);

  // Handle pending redirect after loading completes and navigation is ready
  useEffect(() => {
    if (!isLoading && pendingRedirect) {
      // Small delay to ensure navigation is ready
      const timeout = setTimeout(() => {
        router.replace(pendingRedirect as any);
        setPendingRedirect(null);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, pendingRedirect]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const deviceName = `${Device.deviceName} (${Device.osName} ${Device.osVersion})`;

      try {
        const response = await api.post("/login", {
          email,
          password,
          device_name: deviceName,
        });

        const { token: authToken, errors } = response.data;

        if (errors) {
          return { success: false, errors };
        }

        if (authToken) {
          // Store token
          await setItemAsync(STORE_API_TOKEN_KEY, authToken);
          setToken(authToken);

          // Fetch user profile
          const userResponse = await api.get("/user");
          const userData = userResponse.data;
          dispatch({ type: "set", user: userData });

          // Send expo push token
          const expoToken = await getItemAsync(STORE_EXPO_PUSH_TOKEN_KEY);
          if (expoToken) {
            await api.post("/expo-token", { token: expoToken });
          }

          // Redirect based on first_time_login
          if (userData.first_time_login) {
            router.replace("/(auth)/onboarding");
            return { success: true, isFirstTimeLogin: true };
          } else {
            router.replace("/(tabs)/home");
            return { success: true, isFirstTimeLogin: false };
          }
        }

        return { success: false, errors: { email: ["Authentication failed"] } };
      } catch (error) {
        return {
          success: false,
          errors: { email: ["Network error. Please try again."] },
        };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      // Continue with local logout even if API call fails
    } finally {
      await deleteItemAsync(STORE_API_TOKEN_KEY);
      setToken(null);
      dispatch({ type: "remove" });
    }
  }, []);

  // Call this after user completes onboarding
  const completeFirstTimeLogin = useCallback(async (password: string, passwordConfirmation: string) => {
    try {
      // Update backend with new password (Laravel expects 'password_confirmation' for confirmed rule)
      const response = await api.post("/first-time", {
        password: password,
        password_confirmation: passwordConfirmation,
      });

      if (response.data?.status === "ok") {
        // Update local state
        dispatch({ type: "updateFirstTimeLogin", first_time_login: false });

        // Redirect to main app
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      throw error;
    }
  }, []);

  const authValue = useMemo(
    () => ({
      user: profile,
      token,
      isLoading,
      isAuthenticated,
      isFirstTimeLogin,
      login,
      logout,
      completeFirstTimeLogin,
    }),
    [profile, token, isLoading, isAuthenticated, isFirstTimeLogin, login, logout, completeFirstTimeLogin]
  );

  return (
    <AuthContext.Provider value={authValue}>
      <ProfileContext.Provider value={profile}>
        <ProfileDispatchContext.Provider value={dispatch}>
          {children}
        </ProfileDispatchContext.Provider>
      </ProfileContext.Provider>
    </AuthContext.Provider>
  );
}

// New auth hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Keep backward compatibility with existing useProfile hook
export function useProfile() {
  const profile = useContext(ProfileContext);
  const { isAuthenticated } = useAuth();

  // Only throw if we're authenticated but profile is missing
  // This allows the hook to be used during loading/unauthenticated states
  if (isAuthenticated && !profile) {
    throw new Error("useProfile should be used inside a ProfileProvider");
  }

  return profile;
}

// Keep backward compatibility with existing useProfileDispatch hook
export function useProfileDispatch() {
  const dispatch = useContext(ProfileDispatchContext);

  if (!dispatch) {
    throw new Error("useProfileDispatch should be used inside a ProfileProvider");
  }

  return dispatch;
}

// Optional: Safe version that doesn't throw
export function useProfileSafe() {
  return useContext(ProfileContext);
}
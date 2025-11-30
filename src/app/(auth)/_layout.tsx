import { useAuth } from "@/providers/auth-provider";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AuthLayout() {
  const { isAuthenticated, isLoading, isFirstTimeLogin } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // If authenticated AND first time login, stay in auth group for onboarding
  // (do not redirect to tabs)
  if (isAuthenticated && isFirstTimeLogin) {
    // Let the user access onboarding screen in auth group
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="onboarding" />
      </Stack>
    );
  }

  // Redirect to home if authenticated and NOT first time login
  if (isAuthenticated && !isFirstTimeLogin) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Not authenticated - show login screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
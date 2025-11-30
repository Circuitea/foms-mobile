import api from "@/lib/api";
import { STORE_EXPO_PUSH_TOKEN_KEY, TASK_GET_LOCATION } from "@/lib/constants";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LinearGradient } from "expo-linear-gradient";
import { LocationObject, stopLocationUpdatesAsync } from "expo-location";
import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { useEffect } from "react";
import { ActivityIndicator, ImageBackground, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

dayjs.extend(relativeTime);

TaskManager.defineTask<{ locations: LocationObject[] }>(
  TASK_GET_LOCATION,
  async ({ data: { locations }, error }) => {
    if (error) {
      console.error(error. message);
      return;
    }

    const { latitude, longitude } = locations[0]. coords;

    return api
      .post("/location", {
        latitude,
        longitude,
      })
      .catch((error) => {
        if (error.status === 401) {
          return stopLocationUpdatesAsync(TASK_GET_LOCATION);
        }
      });
  }
);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootContent() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (! isLoading) {
      SplashScreen.hide();
    }
  }, [isLoading]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setItemAsync(STORE_EXPO_PUSH_TOKEN_KEY, token);
          api.post("/expo-token", { token });
        }
      })
      .catch(console.error);

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      responseListener.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1B2560" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/login_bg.jpg")}
        style={{ flex: 1 }}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={["rgba(255, 77, 77, 0.8)", "rgba(27, 37, 96, 0.8)"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Slot />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
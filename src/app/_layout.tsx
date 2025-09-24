import api from "@/lib/api";
import { STORE_EXPO_PUSH_TOKEN_KEY, TASK_GET_LOCATION } from "@/lib/constants";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { ProfileProvider, useProfileDispatch } from "@/providers/ProfileProvider";
import { LinearGradient } from "expo-linear-gradient";
import { LocationObject, stopLocationUpdatesAsync } from "expo-location";
import * as Notifications from 'expo-notifications';
import { router, Stack } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import * as SplashScreen from 'expo-splash-screen';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

TaskManager.defineTask<{ locations: LocationObject[] }>(TASK_GET_LOCATION, async ({ data: { locations }, error }) => {
  if (error) {
    console.error(error.message);
    return;
  }

  const { latitude, longitude } = locations[0].coords;

  console.log(new Date().toISOString());
  console.log('New locations count:', locations.length);

  locations.forEach((location, i) => console.log(`Location[${i}]: (${location.coords.latitude}, ${location.coords.longitude}) - ${location.timestamp} - ${location.mocked ? 'mocked' : 'real'}`))

  return api.post('/location', {
    latitude,
    longitude,
  }).catch(error => {
    if (error.status === 401) {
      return stopLocationUpdatesAsync(TASK_GET_LOCATION);
    }
  });
});

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
    <ProfileProvider>
      <RootContent />
    </ProfileProvider>
  )
}

function RootContent() {
  const profileDispatch = useProfileDispatch();

  useEffect(() => {
    async function initialize() {
      try {
        const response = await api.get('/user');

        profileDispatch({
          type: 'set',
          user: response.data,
        });
        
        router.replace('/(tabs)');
      } catch (error) {
        console.log('Removing profile data');   
        profileDispatch({ type: 'remove' });
      }

    }

    initialize().finally(() => {
      SplashScreen.hide();
    }); 
    
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          setItemAsync(STORE_EXPO_PUSH_TOKEN_KEY, token);
          api.post('/expo-token', {token});
        }
      })
      .catch(console.error);

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    })

    return () => {
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Stack
        screenLayout={({ children }) => (
            <ImageBackground source={require('../../assets/images/login_bg.jpg')} style={{minHeight: '100%'}}>
              <LinearGradient
                style={{ flex: 1 }}
                colors={['rgba(255, 77, 77, 0.8)', 'rgba(27, 37, 96, 0.8)']}
                start={{ x: 0.5, y: 0}}
                end={{ x: 0.5, y: 1}}
              >
                {children}
              </LinearGradient>
            </ImageBackground>
        )}
        screenOptions={{headerShown: false, animation: 'slide_from_right'}}
        >
        <Stack.Screen name="index" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  )
}

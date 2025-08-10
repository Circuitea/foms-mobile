import { api } from "@/lib/api";
import * as Notifications from 'expo-notifications';
import { router, Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function RootLayout() {
    useEffect(() => {
        async function initialize() {
            await api.init();

            const isTokenValid = await api.validateToken();

            if (isTokenValid) {
                router.replace('/(tabs)');
            }
            SplashScreen.hide();
        }

        initialize();
    }, []);

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    )
}
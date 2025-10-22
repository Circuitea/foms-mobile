import Constants from 'expo-constants';
import { isDevice } from "expo-device";
import { AndroidImportance, getExpoPushTokenAsync, getPermissionsAsync, requestPermissionsAsync, setNotificationChannelAsync } from "expo-notifications";
import { Platform } from "react-native";

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
}

export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await setNotificationChannelAsync('default', {
            name: 'default',
            importance: AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (isDevice) {
        const { granted } = await getPermissionsAsync();

        let finalStatus = granted;

        if (!granted) {
            const { granted } = await requestPermissionsAsync();
            finalStatus = granted;
        }

        if (!finalStatus) {
            handleRegistrationError('Permission not granted to get push token for push notifications');
            return;
        }

        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }

        try {
            const pushTokenString = (
                await getExpoPushTokenAsync({
                    projectId,
                })
            ).data;

            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
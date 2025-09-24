import { Accuracy, requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync, startLocationUpdatesAsync } from "expo-location";
import { TASK_GET_LOCATION } from "./constants";

export async function startLocationTracking() {
  const { status: foregroundStatus } = await requestForegroundPermissionsAsync();
  console.log('Foreground:', foregroundStatus);

  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await requestBackgroundPermissionsAsync();
    console.log('Background:', backgroundStatus);

    if (backgroundStatus === 'granted') {
      await startLocationUpdatesAsync(TASK_GET_LOCATION, {
        accuracy: Accuracy.High,
        deferredUpdatesInterval: 1000,
        foregroundService: {
          notificationTitle: 'Field Operations Management System',
          notificationBody: 'Your location is being tracked.',
        },
      }).then(() => console.log('Location Tracking started.'));
    }
  }
}




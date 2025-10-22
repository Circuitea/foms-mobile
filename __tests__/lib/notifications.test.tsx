import { registerForPushNotificationsAsync } from '@/lib/notifications';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { setItemAsync } from 'expo-secure-store';
import { Platform } from 'react-native';

jest.mock('expo-device');
jest.mock('expo-notifications');
jest.mock('expo-secure-store');

describe('Notifications Service', () => {
  const mockNotifications = Notifications as jest.Mocked<typeof Notifications>;
  const mockSetItemAsync = setItemAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
  });

  it('should request permissions and get token on physical device', async () => {
    (Device.isDevice as boolean) = true;
    
    mockNotifications.requestPermissionsAsync.mockResolvedValue({
      status: 'granted',
      canAskAgain: true,
      granted: true,
      expires: null,
    } as any);
    
    mockNotifications.getExpoPushTokenAsync.mockResolvedValue({
      data: 'ExponentPushToken[test-token]',
      type: 'expo',
    } as any);

    const token = await registerForPushNotificationsAsync();
    
    expect(mockNotifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(mockNotifications.getExpoPushTokenAsync).toHaveBeenCalled();
    expect(token).toBe('ExponentPushToken[test-token]');
  });

  it('should handle permission denied', async () => {
    (Device.isDevice as boolean) = true;

    mockNotifications.getPermissionsAsync.mockResolvedValue({
      status: 'denied',
      canAskAgain: false,
      granted: false,
      expires: null,
    } as any);
    
    mockNotifications.requestPermissionsAsync.mockResolvedValue({
      status: 'denied',
      canAskAgain: false,
      granted: false,
      expires: null,
    } as any);

    const token = await registerForPushNotificationsAsync();
    
    expect(mockNotifications.getExpoPushTokenAsync).not.toHaveBeenCalled();
    expect(token).toBeUndefined();
  });
});
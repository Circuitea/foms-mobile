import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

// Mock Expo modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  usePathname: jest.fn(() => '/'),
  useSegments: jest.fn(() => []),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  Stack: {
    Screen: 'Screen',
  },
  Tabs: 'Tabs',
  Link: 'Link',
}));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      removeListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
      key: 'test',
      name: 'test',
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
    NavigationContainer: ({ children }: any) => children,
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-device', () => ({
  deviceName: 'Test Device',
  osName: 'iOS',
  osVersion: '15.0',
  isDevice: true,
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestBackgroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
    },
    timestamp: Date.now(),
  })),
  startLocationUpdatesAsync: jest.fn(),
  stopLocationUpdatesAsync: jest.fn(),
  hasStartedLocationUpdatesAsync: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('expo-notifications', () => ({
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'ExponentPushToken[test]' })),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  setNotificationChannelAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiBaseURL: 'http://localhost:3000',
      eas: {
        projectId: 'test-project-id',
      },
    },
  },
  easConfig: {
    projectId: 'test-project-id',
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
  hide: jest.fn(),
}));

jest.mock('expo-task-manager', () => ({
  defineTask: jest.fn(),
  isTaskRegisteredAsync: jest.fn(() => Promise.resolve(false)),
  unregisterTaskAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test.jpg',
      width: 100,
      height: 100,
      fileName: 'test.jpg',
      mimeType: 'image/jpeg',
    }],
  })),
  launchCameraAsync: jest.fn(() => Promise.resolve({
    canceled: false,
    assets: [{
      uri: 'file://test.jpg',
      width: 100,
      height: 100,
      fileName: 'test.jpg',
      mimeType: 'image/jpeg',
    }],
  })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  MediaTypeOptions: {
    Images: 'Images',
    Videos: 'Videos',
    All: 'All',
  },
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(() => Promise.resolve()),
      localUri: 'file://test-asset',
    })),
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
  addEventListener: jest.fn(() => jest.fn()),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-webview', () => ({
  default: 'WebView',
}));

jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    post: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    put: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    patch: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    delete: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    request: jest.fn(() => Promise.resolve({ data: {}, status: 200 })),
    defaults: {
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        common: {},
      },
    },
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      ...mockAxiosInstance,
    },
  };
});

jest.mock('dayjs', () => {
  const dayjs = jest.requireActual('dayjs');
  return dayjs;
});

// Silence the warning: Animated: `useNativeDriver` is not supported
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

global.alert = jest.fn();
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
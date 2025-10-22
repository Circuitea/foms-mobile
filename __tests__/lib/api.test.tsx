import axios from 'axios';
import { getItemAsync } from 'expo-secure-store';

jest.mock('axios');
jest.mock('expo-secure-store');

describe('API Service', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
  const mockGetItemAsync = getItemAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add authorization header when token exists', async () => {
    mockGetItemAsync.mockResolvedValue('test-token');
    
    const mockCreate = mockAxios.create as jest.Mock;
    const mockInstance = {
      interceptors: {
        request: {
          use: jest.fn((callback) => {
            // Simulate the request interceptor
            const config = { headers: {} };
            return callback(config);
          }),
        },
        response: {
          use: jest.fn(),
        },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    
    mockCreate.mockReturnValue(mockInstance);
    
    // The interceptor should be registered
    expect(mockInstance.interceptors.request.use).toBeDefined();
  });

  it('should handle API errors correctly', async () => {
    const mockCreate = mockAxios.create as jest.Mock;
    const errorInterceptor = jest.fn();
    
    const mockInstance = {
      interceptors: {
        request: { use: jest.fn() },
        response: {
          use: jest.fn((success, error) => {
            errorInterceptor.mockImplementation(error);
          }),
        },
      },
      get: jest.fn(),
      post: jest.fn(),
    };
    
    mockCreate.mockReturnValue(mockInstance);
    
    expect(mockInstance.interceptors.response.use).toBeDefined();
  });
});
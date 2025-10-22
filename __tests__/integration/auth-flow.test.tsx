import Index from '@/app/index';
import api from '@/lib/api';
import { ProfileProvider } from '@/providers/ProfileProvider';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

jest.mock('@/lib/api');
jest.mock('expo-secure-store');

describe('Authentication Flow Integration', () => {
  const mockApi = api as jest.Mocked<typeof api>;
  const mockSetItemAsync = setItemAsync as jest.Mock;
  const mockGetItemAsync = getItemAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete full login flow successfully', async () => {
    const mockUser = {
      id: 1,
      first_name: 'John',
      surname: 'Doe',
      email: 'test@example.com',
      status: 'available',
      position: 'Firefighter',
      profile_picture_filename: null,
    };

    mockApi.post
      .mockResolvedValueOnce({
        data: { token: 'auth-token-123', errors: null },
      })
      .mockResolvedValueOnce({
        data: {},
      });

    mockApi.get.mockResolvedValueOnce({
      data: mockUser,
    });

    mockGetItemAsync.mockResolvedValue('expo-push-token-123');

    const { getByPlaceholderText, getByText } = render(
      <ProfileProvider>
        <Index />
      </ProfileProvider>
    );

    // Fill in login form
    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');

    // Submit form
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      // Verify login API was called
      expect(mockApi.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
        device_name: expect.any(String),
      });

      // Verify token was stored
      expect(mockSetItemAsync).toHaveBeenCalledWith('auth_token', 'auth-token-123');

      // Verify user profile was fetched
      expect(mockApi.get).toHaveBeenCalledWith('/user');

      // Verify expo token was sent
      expect(mockApi.post).toHaveBeenCalledWith('/expo-token', {
        token: 'expo-push-token-123',
      });

      // Verify navigation to home
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('should handle login failure with server errors', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        errors: {
          email: ['These credentials do not match our records.'],
        },
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <ProfileProvider>
        <Index />
      </ProfileProvider>
    );

    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'wrongpassword');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('These credentials do not match our records.')).toBeTruthy();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  it('should handle network errors during login', async () => {
    mockApi.post.mockRejectedValueOnce(new Error('Network Error'));

    const { getByPlaceholderText, getByText } = render(
      <ProfileProvider>
        <Index />
      </ProfileProvider>
    );

    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalled();
    });
  });
});
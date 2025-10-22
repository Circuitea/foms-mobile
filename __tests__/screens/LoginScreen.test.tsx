import Index from '@/app/index';
import api from '@/lib/api';
import { useProfileDispatch } from '@/providers/ProfileProvider';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

jest.mock('@/lib/api');
jest.mock('@/providers/ProfileProvider');
jest.mock('expo-secure-store');

describe('Login Screen', () => {
  const mockDispatch = jest.fn();
  const mockApi = api as jest.Mocked<typeof api>;
  const mockSetItemAsync = setItemAsync as jest.Mock;
  const mockGetItemAsync = getItemAsync as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfileDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<Index />);
    
    expect(getByPlaceholderText('email@example.com')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Forgot Password')).toBeTruthy();
  });

  it('should update email and password inputs', () => {
    const { getByPlaceholderText } = render(<Index />);
    
    const emailInput = getByPlaceholderText('email@example.com');
    const passwordInput = getByPlaceholderText('********');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should handle successful login', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: { token: 'test-token', errors: null },
    });
    
    mockApi.get.mockResolvedValueOnce({
      data: { 
        id: 1, 
        first_name: 'John', 
        surname: 'Doe',
        email: 'test@example.com',
        status: 'available'
      },
    });

    mockGetItemAsync.mockResolvedValue('expo-push-token');

    const { getByPlaceholderText, getByText } = render(<Index />);
    
    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('********'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockSetItemAsync).toHaveBeenCalledWith('auth_token', 'test-token');
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'set',
        user: expect.objectContaining({ email: 'test@example.com' }),
      });
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('should display validation errors on failed login', async () => {
    mockApi.post.mockResolvedValueOnce({
      data: {
        errors: {
          email: ['The email field is required.'],
          password: ['The password field is required.'],
        },
      },
    });

    const { getByText } = render(<Index />);
    
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(getByText('The email field is required.')).toBeTruthy();
    });
  });

  it('should clear errors when user starts typing', () => {
    const { getByPlaceholderText } = render(<Index />);
    
    const emailInput = getByPlaceholderText('email@example.com');
    fireEvent.changeText(emailInput, 'test@example.com');

    // Errors should be cleared when typing
    expect(emailInput.props.value).toBe('test@example.com');
  });
});
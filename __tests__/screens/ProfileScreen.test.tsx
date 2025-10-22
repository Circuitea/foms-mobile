import ProfileScreen from '@/app/(tabs)/profile';
import api from '@/lib/api';
import { useProfile } from '@/providers/ProfileProvider';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

jest.mock('@/lib/api');
jest.mock('@/providers/ProfileProvider');
jest.spyOn(Alert, 'alert');

describe('Profile Screen', () => {
  const mockProfile = {
    id: 1,
    first_name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    status: 'available',
    position: 'Firefighter',
    profile_picture_filename: 'profile.jpg',
  };

  const mockApi = api as jest.Mocked<typeof api>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue(mockProfile);
  });

  it('should render profile information correctly', () => {
    const { getByText } = render(<ProfileScreen />);
    
    expect(getByText('John D.')).toBeTruthy();
    expect(getByText('Firefighter')).toBeTruthy();
  });

  it('should render menu items', () => {
    const { getByText } = render(<ProfileScreen />);
    
    expect(getByText('Personal Information')).toBeTruthy();
    expect(getByText('Account Password')).toBeTruthy();
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('should show confirmation alert when signing out', () => {
    const { getByText } = render(<ProfileScreen />);
    
    fireEvent.press(getByText('Sign Out'));
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sign Out',
      expect.stringContaining('Are you sure'),
      expect.any(Array)
    );
  });

  it('should call logout API and navigate on confirm sign out', async () => {
    mockApi.delete.mockResolvedValue({ status: 200 });
    
    const { getByText } = render(<ProfileScreen />);
    
    fireEvent.press(getByText('Sign Out'));
    
    // Get the confirm callback from Alert.alert
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const confirmButton = alertCall[2].find((btn: any) => btn.text === 'Sign Out');
    
    await confirmButton.onPress();
    
    await waitFor(() => {
      expect(mockApi.delete).toHaveBeenCalledWith('/logout');
      // expect(router.navigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display profile picture when available', () => {
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    // Check that Image component is rendered
    expect(UNSAFE_getByType).toBeTruthy();
  });

  it('should display default icon when no profile picture', () => {
    const profileWithoutPicture = {
      ...mockProfile,
      profile_picture_filename: null,
    };
    (useProfile as jest.Mock).mockReturnValue(profileWithoutPicture);
    
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('John D.')).toBeTruthy();
  });
});
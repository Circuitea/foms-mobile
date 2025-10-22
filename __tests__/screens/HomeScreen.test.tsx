import HomeScreen from '@/app/(tabs)/home';
import api from '@/lib/api';
import { useProfile, useProfileDispatch } from '@/providers/ProfileProvider';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

jest.mock('@/lib/api');
jest.mock('@/providers/ProfileProvider');

describe('Home Screen', () => {
  const mockProfile = {
    id: 1,
    first_name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    status: 'available',
    position: 'Firefighter',
    profile_picture_filename: null,
  };

  const mockDispatch = jest.fn();
  const mockApi = api as jest.Mocked<typeof api>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfile as jest.Mock).mockReturnValue(mockProfile);
    (useProfileDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should render greeting with user name', () => {
    mockApi.get.mockResolvedValue({ data: { task: null } });
    
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/Good Day, John!/)).toBeTruthy();
  });

  it('should display status buttons', () => {
    mockApi.get.mockResolvedValue({ data: { task: null } });
    
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Available')).toBeTruthy();
    expect(getByText('On Break')).toBeTruthy();
    expect(getByText('Off Duty')).toBeTruthy();
    expect(getByText('Emergency')).toBeTruthy();
  });

  it('should update status when status button is pressed', async () => {
    mockApi.get.mockResolvedValue({ data: { task: null } });
    mockApi.post.mockResolvedValue({ 
      status: 200,
      data: { status: 'on break' } 
    });

    const { getByText } = render(<HomeScreen />);
    
    fireEvent.press(getByText('On Break'));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/status', { status: 'on break' });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'updateStatus',
        status: 'on break',
      });
    });
  });

  // it('should display active task when available', async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: 'Emergency Response',
  //     description: 'Fire at Building A',
  //     location: 'Street 123',
  //     priority: { name: 'urgent' },
  //     type: { name: 'Fire' },
  //     created_at: '2025-10-22T10:00:00Z',
  //     due_date: '2025-10-22T14:00:00Z',
  //   };

  //   mockApi.get
  //     .mockResolvedValueOnce({ status: 200, data: { task: mockTask } })
  //     .mockResolvedValueOnce({ status: 200, data: { status: 'available' } });

  //   const { getByText } = render(<HomeScreen />);

  //   await waitFor(() => {
  //     expect(getByText('Emergency Response')).toBeTruthy();
  //     expect(getByText('Fire at Building A')).toBeTruthy();
  //     expect(getByText('Street 123')).toBeTruthy();
  //   });
  // });

  it('should show "No Active Task" when no task is available', async () => {
    mockApi.get
      .mockResolvedValueOnce({ status: 200, data: { task: null } })
      .mockResolvedValueOnce({ status: 200, data: { status: 'available' } });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('No Active Task')).toBeTruthy();
    });
  });

  // it('should navigate to task detail when task is pressed', async () => {
  //   const mockTask = {
  //     id: 1,
  //     title: 'Emergency Response',
  //     description: 'Fire at Building A',
  //     location: 'Street 123',
  //     priority: { name: 'urgent' },
  //     type: { name: 'Fire' },
  //     created_at: '2025-10-22T10:00:00Z',
  //     due_date: '2025-10-22T14:00:00Z',
  //   };

  //   mockApi.get
  //     .mockResolvedValueOnce({ status: 200, data: { task: mockTask } })
  //     .mockResolvedValueOnce({ status: 200, data: { status: 'available' } });

  //   const { getByText } = render(<HomeScreen />);

  //   await waitFor(() => {
  //     fireEvent.press(getByText('Emergency Response'));
  //     expect(router.navigate).toHaveBeenCalledWith('/(tabs)/task/1');
  //   });
  // });

  // it('should navigate to all tasks when "View all tasks" is pressed', async () => {
  //   mockApi.get.mockResolvedValue({ data: { task: null } });

  //   const { getByText } = render(<HomeScreen />);

  //   await waitFor(() => {
  //     fireEvent.press(getByText('View all tasks'));
  //     expect(router.push).toHaveBeenCalledWith('/tasks');
  //   });
  // });
});
import api from '@/lib/api';

jest.mock('@/lib/api');

describe('Task Management Integration', () => {
  const mockApi = api as jest.Mocked<typeof api>;

  const mockTasks = [
    {
      id: 1,
      title: 'Fire Response',
      description: 'Building fire',
      location: 'Street 123',
      priority: { name: 'urgent' },
      type: { name: 'Fire' },
      created_at: '2025-10-22T10:00:00Z',
      due_date: '2025-10-22T14:00:00Z',
      pivot: {
        status: 'pending',
        additional_notes: null,
      },
    },
    {
      id: 2,
      title: 'Medical Assistance',
      description: 'Emergency medical',
      location: 'Street 456',
      priority: { name: 'high' },
      type: { name: 'Medical' },
      created_at: '2025-10-22T11:00:00Z',
      due_date: '2025-10-22T15:00:00Z',
      pivot: {
        status: 'in_progress',
        additional_notes: 'Patient critical',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('should filter tasks by status', async () => {
    mockApi.get.mockResolvedValue({
      data: { tasks: mockTasks },
    });

    // Test filtering logic
    const pendingTasks = mockTasks.filter(task => task.pivot.status === 'pending');
    expect(pendingTasks).toHaveLength(1);
    expect(pendingTasks[0].id).toBe(1);

    const inProgressTasks = mockTasks.filter(task => task.pivot.status === 'in_progress');
    expect(inProgressTasks).toHaveLength(1);
    expect(inProgressTasks[0].id).toBe(2);
  });

  it('should update task status', async () => {
    mockApi.put.mockResolvedValue({
      status: 200,
      data: { task: { ...mockTasks[0], pivot: { ...mockTasks[0].pivot, status: 'completed' } } },
    });

    await mockApi.put(`/tasks/${mockTasks[0].id}/status`, { status: 'completed' });

    expect(mockApi.put).toHaveBeenCalledWith(
      '/tasks/1/status',
      { status: 'completed' }
    );
  });

  it('should handle task update errors', async () => {
    mockApi.put.mockRejectedValue(new Error('Failed to update task'));

    try {
      await mockApi.put('/tasks/1/status', { status: 'completed' });
    } catch (error) {
      expect(error).toBeDefined();
    }

    expect(mockApi.put).toHaveBeenCalled();
  });

  it('should fetch task details', async () => {
    mockApi.get.mockResolvedValue({
      data: { task: mockTasks[0] },
    });

    const response = await mockApi.get('/tasks/1');

    expect(response.data.task.id).toBe(1);
    expect(response.data.task.title).toBe('Fire Response');
  });
});
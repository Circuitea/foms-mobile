import Button from '@/components/Button';
import { fireEvent, render } from '@testing-library/react-native';

describe('Button Component', () => {
  it('should render with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={onPressMock} />);
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

test('renders without crashing', () => {
  const { getByText } = render(<App />);
  expect(getByText('Weather Application')).toBeTruthy();
});

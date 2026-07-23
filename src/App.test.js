import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app footer heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Om Glutenfri & Melkefri Ukemenyplanlegger/i);
  expect(headingElement).toBeInTheDocument();
});

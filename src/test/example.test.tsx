import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ToastProvider>{children}</ToastProvider>
  </BrowserRouter>
);

describe('Button Component', () => {
  it('renders button with text', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <TestWrapper>
        <Button isLoading>Loading</Button>
      </TestWrapper>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('is disabled when loading', () => {
    render(
      <TestWrapper>
        <Button isLoading>Button</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('Accessibility', () => {
  it('button has proper role', () => {
    render(
      <TestWrapper>
        <Button>Accessible Button</Button>
      </TestWrapper>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});


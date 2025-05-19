// client/src/pages/__tests__/LoginPage.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event'; // 👈 Import userEvent here

import { BrowserRouter } from 'react-router-dom'; // Needed because LoginPage uses Link/useNavigate
import { AuthProvider } from '../../context/AuthContext'; // Needed if component uses useAuth
import LoginPage from '../../pages/LoginPage.tsx'; // Import the component to test

// --- Mocking Dependencies ---
// Mock the API module used by the component
vi.mock('../../api/auth', () => ({
  loginUser: vi.fn(), // Mock the loginUser function
}));

// Mock react-router-dom hooks if needed (useNavigate is mocked automatically often, but Link needs Router)
// const mockedNavigate = vi.fn();
// vi.mock('react-router-dom', async () => {
//   const original = await vi.importActual('react-router-dom');
//   return {
//     ...original, // Keep original components like BrowserRouter, Link
//     useNavigate: () => mockedNavigate, // Mock the hook
//   };
// });
// --- End Mocking ---


// Helper function to render with necessary providers
const renderLoginPage = () => {
  render(
    <BrowserRouter> {/* Wrap with Router */}
      <AuthProvider> {/* Wrap with Context Provider */}
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Test Suite
describe('LoginPage Component', () => {
  // Test Case 1: Renders the form correctly
  it('should render login form elements', () => {
    renderLoginPage();

    // Check if heading, email input, password input, and button are present
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  // Test Case 2: Allows typing in fields
  it('should update email and password fields on user input', async () => {
    renderLoginPage();
    const user = userEvent.setup(); // Use user-event for realistic interactions

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  // Test Case 3: Calls login API on submit (Example - needs mock setup)
  // it('should call loginUser API on form submission', async () => {
  //   renderLoginPage();
  //   const user = userEvent.setup();
  //   const { loginUser } = await import('../../api/auth'); // Get the mock function

  //   const emailInput = screen.getByLabelText(/email/i);
  //   const passwordInput = screen.getByLabelText(/password/i);
  //   const submitButton = screen.getByRole('button', { name: /login/i });

  //   await user.type(emailInput, 'test@example.com');
  //   await user.type(passwordInput, 'password123');
  //   await user.click(submitButton);

  //   // Expect the mocked loginUser function to have been called
  //   expect(loginUser).toHaveBeenCalledOnce();
  //   expect(loginUser).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  // });

  // Add more tests: validation errors, API error handling display, redirection calls etc.
});
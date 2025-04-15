// client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth'; // API function for logging in
import { useNavigate, Link } from 'react-router-dom'; // Hooks and components for routing
import { useAuth } from '../context/AuthContext'; // Import the custom hook to access AuthContext

function LoginPage() {
  // --- State for Form Inputs ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- State for Feedback ---
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Routing Hook ---
  const navigate = useNavigate();

  // --- Get login function from AuthContext ---
  const { login } = useAuth(); // Use the custom hook to get context values

  // --- Form Submission Handler ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default browser form submission
    setMessage(null);       // Clear previous messages on new attempt
    setError(null);

    try {
      // Prepare credentials from state
      const credentials = { email, password };

      // Call the login API function (defined in api/auth.ts)
      const response = await loginUser(credentials);

      console.log('Login Successful API Response:', response);

      // --- Use the context's login function to update state and localStorage ---
      login(response.token); // Pass the received token to the context's login method
      // --- End context login ---

      // Redirect to the dashboard after successful login
      navigate('/dashboard');

      // Clearing form fields might not be strictly necessary upon redirect
      // setEmail('');
      // setPassword('');

    } catch (apiError: any) {
      // Handle errors from the loginUser API call
      console.error('Login failed:', apiError);
      // Display the error message from the backend or a generic one
      setError(apiError.message || 'Login failed. Please check your credentials.');
      // It's good practice to clear the password field on error
      setPassword('');
    }
  };

  // --- Render the Component ---
  return (
    <div>
      <h1>Login</h1>

      {/* Display Feedback Messages */}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="login-email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="login-email" // Unique ID for the label's htmlFor
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email" // Help browser autofill
            style={{ padding: '8px', width: '250px' }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="login-password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="login-password" // Unique ID for the label's htmlFor
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // Help browser autofill
            style={{ padding: '8px', width: '250px' }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Login
        </button>
      </form>

      {/* Link to Registration Page */}
      <p style={{ marginTop: '15px' }}>
        Don't have an account?{' '}
        {/* Use React Router's Link for better SPA navigation */}
        <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
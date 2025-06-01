// client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const credentials = { email, password };
      const response = await loginUser(credentials);

      login(response.token);
      navigate('/dashboard');
    } catch (apiError: any) {
      setError(apiError.message || 'Login failed. Please check your credentials.');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      {message && <p className="login-message success">{message}</p>}
      {error && <p className="login-message error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="form-input"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="register-text">
        Don't have an account?{' '}
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;

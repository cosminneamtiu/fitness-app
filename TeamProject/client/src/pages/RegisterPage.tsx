import React, { useState } from 'react';
import { registerUser } from '../api/auth';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const userData = { name, email, password };
      const response = await registerUser(userData);

      setMessage(response.message || 'Registration successful!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (apiError: any) {
      setError(apiError.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Register for an Account</h1>

      {message && <p className="register-message success">{message}</p>}
      {error && <p className="register-message error">{error}</p>}

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="form-input"
            placeholder="Enter a strong password"
          />
        </div>

        <button type="submit" className="butreg">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

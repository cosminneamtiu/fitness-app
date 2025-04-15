// client/src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { registerUser } from '../api/auth'; // Import the API function we created

function RegisterPage() {
  // --- State Variables for Form Inputs ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState(''); // Optional

  // --- State Variables for Feedback ---
  const [message, setMessage] = useState<string | null>(null); // For success/error messages from API
  const [error, setError] = useState<string | null>(null);     // Specifically for errors

  // --- Form Submission Handler ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default page reload
    setMessage(null);       // Clear previous messages on new submission
    setError(null);

    // --- Optional client-side validation ---
    // if (password.length < 6) {
    //   setError("Password must be at least 6 characters long.");
    //   return;
    // }
    // if (password !== confirmPassword) { // If using confirm password field
    //   setError("Passwords do not match!");
    //   return;
    // }
    // --- End validation ---

    try {
      // Prepare user data from state
      const userData = { name, email, password };

      // Call the API function
      const response = await registerUser(userData);

      console.log('API Response:', response); // Log the success response from the backend
      setMessage(response.message || 'Registration successful!'); // Display success message

      // Clear the form fields on successful registration
      setName('');
      setEmail('');
      setPassword('');
      // setConfirmPassword(''); // Clear confirm password if using

      // --- Optional: Redirect to login page ---
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate(); // Call this hook at the top of the component
      // navigate('/login'); // Call this after setting the success message
      // --- End redirect ---

    } catch (apiError: any) {
      // Catch errors thrown from the registerUser function (e.g., network error, server error)
      console.error('Registration failed:', apiError);
      // Display the error message provided by the API or a generic one
      setError(apiError.message || 'Registration failed. Please try again.');
    }
  };

  // --- Render the Component ---
  return (
    <div>
      <h1>Register for an Account</h1>

      {/* Display Success or Error Messages */}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Registration Form */}
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div style={{ marginBottom: '10px' }}> {/* Added basic styling for spacing */}
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: '8px', width: '250px' }} // Basic styling
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', width: '250px' }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Ensure this matches backend requirements if any
            style={{ padding: '8px', width: '250px' }}
          />
        </div>

        {/* Optional: Confirm Password Field
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: '8px', width: '250px' }}
          />
        </div>
        */}

        <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
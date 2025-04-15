// client/src/api/auth.ts

// Define the base URL of your backend server
const API_BASE_URL = 'http://localhost:3001'; // Make sure this matches your server's port!

// Define the shape of the user data for registration
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (userData: RegisterUserData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell the server we're sending JSON
      },
      body: JSON.stringify(userData), // Convert the JavaScript object to a JSON string
    });

    // Check if the response status code indicates an error (e.g., 400, 500)
    if (!response.ok) {
      // Try to parse the error message from the backend response body
      const errorData = await response.json();
      // Throw an error that includes the message from the backend
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    // If the response is OK (e.g., 201 Created), parse the success message
    const data = await response.json();
    return data; // Should contain { message: 'User registered successfully' }

  } catch (error) {
    console.error("Registration API call failed:", error);
    // Re-throw the error so the component calling this function can handle it
    throw error;
  }
};

// We will add the login API call function here later


// --- Add Login User Function ---
interface LoginCredentials {
    email: string;
    password: string;
  }
  
  // Define the expected shape of the successful login response
  interface LoginResponse {
      message: string;
      token: string; // The JWT token from the backend
  }
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      const data = await response.json(); // Always try to parse JSON response
  
      if (!response.ok) {
        // Use the error message from the backend response body if available
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
  
      // If response is OK, expect data to include the token
      if (!data.token) {
          // This case shouldn't happen if the backend is correct, but good to check
          throw new Error('Login successful, but no token received.');
      }
  
      return data as LoginResponse; // Return the parsed data (including the token)
  
    } catch (error) {
      console.error("Login API call failed:", error);
      throw error; // Re-throw the error for the component to handle
    }
  };
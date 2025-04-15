// client/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
// Optional: Decode JWT to get user info (install jwt-decode: npm install jwt-decode)
// import { jwtDecode } from 'jwt-decode';

// Define the shape of the context state
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  // Optional: Add user info if needed
  // user: { id: number; name: string } | null;
  login: (newToken: string) => void;
  logout: () => void;
}

// Create the context with a default value
// The '!' tells TypeScript we'll provide a value via the Provider
const AuthContext = createContext<AuthContextType>(null!);

// Create a custom hook for easy context consumption
export const useAuth = () => {
  return useContext(AuthContext);
};

// Define props for the provider component
interface AuthProviderProps {
  children: ReactNode; // To wrap around other components
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  // Optional user state
  // const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  // --- Check localStorage for existing token on initial load ---
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Optional: Validate token expiry here before setting it
      // try {
      //     const decoded = jwtDecode<{ exp: number }>(storedToken);
      //     if (decoded.exp * 1000 > Date.now()) { // Check if expired
                 setToken(storedToken);
      //         // setUser({ id: decoded.userId, name: decoded.name }); // Assuming payload has these
      //     } else {
      //         localStorage.removeItem('authToken'); // Remove expired token
      //     }
      // } catch (error) {
      //     console.error("Error decoding token on load:", error);
      //     localStorage.removeItem('authToken');
      // }
    }
  }, []); // Empty dependency array means this runs only once on mount

  // --- Login Function ---
  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken); // Persist token
    setToken(newToken);
    // Optional: Decode and set user info
    // try {
    //     const decoded = jwtDecode<{ userId: number; name: string }>(newToken);
    //     setUser({ id: decoded.userId, name: decoded.name });
    // } catch (error) {
    //     console.error("Error decoding token on login:", error);
    //     setUser(null);
    // }
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem('authToken'); // Remove token from storage
    setToken(null);
    // setUser(null); // Clear user info
    // Optional: Redirect to login page after logout
    // navigate('/login'); // You'd need useNavigate here or handle it in the component calling logout
  };

  // --- Value provided by the context ---
  const value = {
    token,
    isAuthenticated: !!token, // True if token exists, false otherwise
    // user,
    login,
    logout,
  };

  // Wrap children components with the context provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
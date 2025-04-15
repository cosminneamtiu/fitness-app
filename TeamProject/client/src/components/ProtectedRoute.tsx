// client/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Option 1: Using Outlet for nested routes (often preferred)
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation(); // Get the current location

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child route element
  return <Outlet />;
};

// Option 2: Passing children prop (Simpler for single routes)
/*
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, saving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the children directly
    return <>{children}</>; // Render the protected component passed as children
};
*/

export default ProtectedRoute;
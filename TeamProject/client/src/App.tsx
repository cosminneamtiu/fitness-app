// client/src/App.tsx
import React from 'react';
import { Routes, Route, Link, useNavigate, NavLink } from 'react-router-dom'; // Import NavLink for active styling
import './index.css'; // Use the updated global CSS

// Import Page Components (assuming they are now separate files)
import HomePage from './pages/HomePage'; // Example import
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ClassesPage from './pages/ClassesPage';
import DashboardPage from './pages/DashboardPage';
import ClassDetailPage from './pages/ClassDetailPage'; // 👈 Import the new detail page

// Import Auth Context Hook & ProtectedRoute Component
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Main App Component ---
function App() {
  // Get authentication state and logout function from the context
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handler for the logout action
  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect the user to the login page
    console.log("User logged out successfully.");
  };

  // Helper for NavLink active class (optional)
  const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    fontWeight: isActive ? 'bold' : '500',
    borderBottom: isActive ? '2px solid var(--fb-color-link)' : '2px solid transparent',
    color: isActive ? 'var(--fb-color-link)' : 'var(--fb-color-text-primary)' // Use CSS variable for color
  });


  return (
    <div className="App">
      {/* Site Header and Navigation */}
      <header className="site-header">
        <nav>
            <ul>
            <li>
                {/* Use NavLink for active styling */}
                <NavLink to="/" style={navLinkStyle}>Home</NavLink>
            </li>
            <li>
                <NavLink to="/classes" style={navLinkStyle}>Classes</NavLink>
            </li>

            {/* Conditionally Render Links/Buttons based on Auth State */}
            {isAuthenticated ? (
                <>
                <li>
                    <NavLink to="/dashboard" style={navLinkStyle}>Dashboard</NavLink>
                </li>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
                </>
            ) : (
                <>
                <li>
                    <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
                </li>
                <li>
                    <NavLink to="/register" style={navLinkStyle}>Register</NavLink>
                </li>
                </>
            )}
            </ul>
        </nav>
      </header>

      {/* Main Content Area - Routes Define What Component Renders */}
      <main> {/* Removed padding here if added via CSS */}
        <Routes>
          {/* === Public Routes === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          {/* Dynamic route for Class Detail - :classId is a URL parameter */}
          <Route path="/classes/:classId" element={<ClassDetailPage />} /> {/* 👈 Add dynamic route */}

          {/* === Protected Routes === */}
          {/* Routes nested under this element will require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Add more protected routes here, e.g., /profile, /my-settings */}
          </Route>

          {/* === Fallback Route for unmatched paths === */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>404 - Page Not Found</h2>
              <p>Sorry, the page you are looking for doesn't exist.</p>
              <Link to="/" style={{ color: 'var(--fb-color-link)' }}>Go back to Home</Link>
            </div>
          } />
        </Routes>
      </main>

      {/* Optional Footer could go here */}
      {/* <footer className="site-footer"> <p>© 2025 Your Fitness App</p> </footer> */}

    </div>
  );
}

export default App;
// client/src/pages/ClassDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'; // Import necessary hooks/components
import { getSingleClass, registerForClass } from '../api/classes'; // Import API functions
import { useAuth } from '../context/AuthContext'; // Import auth context

// Define interface matching the detailed class data (re-use or import)
interface FitnessClassDetail {
    id: number;
    name: string;
    description: string;
    instructorName: string;
    schedule: string;
    duration: number;
    capacity: number;
    location?: string | null;
    difficulty: string;
    classType: string;
    createdAt: string;
    _count?: { // Expect registration count
        registrations: number;
    };
}

function ClassDetailPage() {
  // Get classId from URL parameters
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location for potential login redirect state

  // State variables
  const [classData, setClassData] = useState<FitnessClassDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationFeedback, setRegistrationFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  // Optional: State to track if current user is registered for THIS class
  // const [isRegistered, setIsRegistered] = useState<boolean>(false); // Needs logic to check

  // Get auth context
  const { isAuthenticated, token } = useAuth();

  // --- Effect to Fetch Class Details ---
  useEffect(() => {
    const numericClassId = Number(classId);
    if (!classId || isNaN(numericClassId)) {
      setError("Invalid Class ID.");
      setLoading(false);
      return;
    }

    const fetchClass = async () => {
      try {
        setLoading(true);
        setError(null);
        setRegistrationFeedback(null);
        const data = await getSingleClass(numericClassId);
        setClassData(data);
        // Optional: Add logic here to check if the current user is registered for this class
        // This would typically involve fetching user registrations or comparing against dashboard data
      } catch (apiError: any) {
        setError(apiError.message || "Failed to load class details.");
        console.error("Fetch class detail error:", apiError);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [classId]); // Dependency array includes classId

  // --- Handler for Registration Button ---
  const handleRegister = async () => {
    const numericClassId = Number(classId);
    if (!isAuthenticated || !token || !classData) {
      // Redirect to login, passing the current page as 'from' location
      navigate('/login', { state: { from: location, message: "Please log in to register." } });
      return;
    }

    const currentRegistrations = classData._count?.registrations ?? 0;
    if (currentRegistrations >= classData.capacity) {
      setRegistrationFeedback({ type: 'error', message: 'Sorry, this class is already full.' });
      return;
    }
    // Add check here if isRegistered state is implemented
    // if (isRegistered) {
    //    setRegistrationFeedback({ type: 'info', message: 'You are already registered.' });
    //    return;
    // }

    setRegistrationFeedback(null); // Clear previous feedback

    try {
      const response = await registerForClass({ classId: numericClassId }, token);
      setRegistrationFeedback({ type: 'success', message: response.message || 'Successfully registered!' });
      // Update local state optimistically or refetch data
      setClassData(prev => prev ? ({ ...prev, _count: { registrations: (prev._count?.registrations ?? 0) + 1 } }) : null);
      // setIsRegistered(true); // Update registration status if tracked

    } catch (apiError: any) {
      setRegistrationFeedback({ type: 'error', message: apiError.message || 'Registration failed.' });
    }
  };

  // --- Render Logic ---
  if (loading) {
    return <p>Loading class details...</p>;
  }

  if (error) {
    return <div className="feedback-message error">Error: {error}. <Link to="/classes">Back to Classes</Link></div>;
  }

  if (!classData) {
    return <p>Class not found. <Link to="/classes">Back to Classes</Link></p>;
  }

  // Derived state for rendering
  const currentRegistrations = classData._count?.registrations ?? 0;
  const spotsRemaining = Math.max(0, classData.capacity - currentRegistrations); // Ensure spots >= 0
  const isFull = spotsRemaining === 0;
  // Replace with actual logic if tracking user registration status
  const isUserRegistered = false; // Placeholder
  const canRegister = !isFull && !isUserRegistered;

  return (
    <div className="class-detail-page">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--fb-color-text-secondary)' }}>
          <Link to="/classes" style={{ color: 'var(--fb-color-link)' }}>Classes</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{classData.name}</span>
      </nav>

      {/* Class Title and Basic Info */}
      <h1>{classData.name}</h1>
      <p style={{ marginTop: '-0.5rem', marginBottom: '1rem', color: 'var(--fb-color-text-secondary)' }}>
          {classData.classType} | {classData.difficulty} | {classData.duration} minutes
      </p>

      {/* Main Details Section */}
      <div style={{ borderTop: '1px solid var(--fb-color-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
          <p><strong>Instructor:</strong> {classData.instructorName}</p>
          <p><strong>When:</strong> {new Date(classData.schedule).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
          {classData.location && <p><strong>Location:</strong> {classData.location}</p>}
          <p>
              <strong>Availability:</strong> {spotsRemaining} spot(s) remaining out of {classData.capacity}
              {isFull && <span style={{ fontWeight: 'bold', color: '#dc3545' }}> (Full)</span>}
          </p>
          <p style={{ marginTop: '1rem' }}><strong>Description:</strong></p>
          <p>{classData.description}</p> {/* Display full description */}
      </div>

      {/* Registration Action Section */}
      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--fb-color-border)' }}>
          <h3>Register for this Class</h3>
          {isAuthenticated ? (
              <div>
                  <button
                      onClick={handleRegister}
                      disabled={!canRegister} // Disable if full or already registered
                      className="button" // Use button class
                  >
                      {isFull ? 'Class Full' : (isUserRegistered ? 'Already Registered' : 'Register Now')}
                  </button>
                  {/* Display registration feedback */}
                  {registrationFeedback && (
                      <p className={`feedback-message ${registrationFeedback.type}`} style={{marginTop: '10px'}}>
                          {registrationFeedback.message}
                      </p>
                  )}
              </div>
          ) : (
              <p>
                  Please <Link to="/login" state={{ from: location, message: "Please log in to register for this class." }}>log in</Link> or <Link to="/register">create an account</Link> to register.
              </p>
          )}
      </div>

    </div>
  );
}

export default ClassDetailPage;
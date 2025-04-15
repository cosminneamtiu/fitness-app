// client/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// Import BOTH API functions used on this page
import { getMyRegistrations, cancelRegistration } from '../api/registrations'; // 👈 Ensure both are imported
import { Link } from 'react-router-dom'; // For the link to classes page

// --- Interfaces ---
interface ClassInRegistration {
    id: number;
    name: string;
    schedule: string;
    instructorName: string;
    duration: number;
}
interface UserRegistration {
    id: number; // This is the Registration ID, needed for cancellation
    class: ClassInRegistration;
}

// --- Dashboard Component ---
function DashboardPage() {
    // State Variables
    const [myRegistrations, setMyRegistrations] = useState<UserRegistration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // State to manage feedback/status for cancellation attempts, keyed by registration ID
    const [cancelStatus, setCancelStatus] = useState<{ [key: number]: { type: 'info' | 'error' | 'success', message: string } }>({});

    // Get auth context
    const { token, isAuthenticated } = useAuth();

    // --- Effect to Fetch Registrations ---
    useEffect(() => {
        if (isAuthenticated && token) {
            const fetchRegistrations = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const data = await getMyRegistrations(token);
                    setMyRegistrations(data);
                } catch (apiError: any) {
                    setError(apiError.message || "Failed to load your registered classes.");
                    console.error("Dashboard fetch error:", apiError);
                } finally {
                    setLoading(false);
                }
            };
            fetchRegistrations();
        } else {
            setError("You must be logged in to view the dashboard.");
            setLoading(false);
            setMyRegistrations([]);
        }
    }, [token, isAuthenticated]); // Dependencies: run when auth state changes


    // --- Handler for Cancel Button Click ---
    const handleCancel = async (registrationId: number) => {
        // Ensure user is logged in
        if (!token) {
          setError("Cannot cancel: Not authenticated."); // Should ideally not happen due to ProtectedRoute
          return;
        }

        // Set status to indicate cancellation is in progress for this specific item
        setCancelStatus(prev => ({ ...prev, [registrationId]: { type: 'info', message: 'Cancelling...' } }));

        // Confirm with the user before proceeding
        if (window.confirm("Are you sure you want to cancel this registration?")) {
          try {
            // Call the API function to cancel the registration
            await cancelRegistration(registrationId, token);

            // --- Update UI on Success ---
            // Remove the cancelled registration from the local state array immediately
            setMyRegistrations(prevRegistrations =>
              prevRegistrations.filter(reg => reg.id !== registrationId)
            );

            // Optionally, set a success status (which could then be cleared after a timeout)
            // setCancelStatus(prev => ({ ...prev, [registrationId]: { type: 'success', message: 'Cancelled!' } }));
            // Clear status object for this ID if preferred after success instead of showing message
             const updatedStatus = { ...cancelStatus };
             delete updatedStatus[registrationId];
             setCancelStatus(updatedStatus);

             console.log(`Registration ${registrationId} cancelled successfully.`);
             // alert("Registration cancelled successfully."); // Or use a more subtle notification

          } catch (cancelError: any) {
            console.error(`Failed to cancel registration ${registrationId}:`, cancelError);
            // Set an error status message for this specific item
            setCancelStatus(prev => ({ ...prev, [registrationId]: { type: 'error', message: `Error: ${cancelError.message}` } }));
          }
        } else {
           // User clicked "Cancel" on the confirmation dialog - clear the 'Cancelling...' status
           const updatedStatus = { ...cancelStatus };
           delete updatedStatus[registrationId];
           setCancelStatus(updatedStatus);
           console.log(`Cancellation for registration ${registrationId} aborted by user.`);
        }
      };

    // --- Render Component UI ---
    return (
        <div>
            <h1>My Dashboard</h1>
            <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>My Registered Classes</h2>

            {loading && <p>Loading your registrations...</p>}
            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>}

            {!loading && !error && (
                <div>
                    {myRegistrations.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {myRegistrations.map((reg) => {
                                // Check if there's a cancellation status for this specific registration
                                const currentCancelStatus = cancelStatus[reg.id];
                                // Determine if the button should be disabled (e.g., while cancelling)
                                const isCancelling = currentCancelStatus?.type === 'info';

                                return (
                                    <li key={reg.id} style={{ border: '1px solid #eee', background: '#f9f9f9', padding: '15px 20px', marginBottom: '15px', borderRadius: '5px',color: '#333', opacity: isCancelling ? 0.7 : 1 }}>
                                        <h3 style={{ marginTop: 0, marginBottom: '8px' }}>{reg.class.name}</h3>
                                        <p style={{ margin: '4px 0' }}><strong>Instructor:</strong> {reg.class.instructorName}</p>
                                        <p style={{ margin: '4px 0' }}><strong>When:</strong> {new Date(reg.class.schedule).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                                        <p style={{ margin: '4px 0' }}><strong>Duration:</strong> {reg.class.duration} minutes</p>

                                        {/* Cancel Button & Status Display */}
                                        <div style={{ marginTop: '10px' }}>
                                            <button
                                                onClick={() => handleCancel(reg.id)}
                                                disabled={isCancelling} // Disable button if cancellation is in progress
                                                style={{
                                                    background: '#dc3545',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '4px',
                                                    cursor: isCancelling ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                {isCancelling ? 'Cancelling...' : 'Cancel Registration'}
                                            </button>

                                            {/* Display cancellation status message if it exists */}
                                            {currentCancelStatus && currentCancelStatus.type !== 'info' && ( // Don't show 'Cancelling...' message here
                                                <p style={{
                                                    color: currentCancelStatus.type === 'error' ? 'red' : 'green',
                                                    fontSize: '0.9em',
                                                    marginTop: '8px',
                                                    marginBottom: 0,
                                                    fontWeight: 'bold'
                                                }}>
                                                    {currentCancelStatus.message}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>You haven't registered for any classes yet. Visit the <Link to="/classes" style={{ color: '#007bff' }}>Classes page</Link> to find one!</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default DashboardPage;
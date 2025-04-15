// client/src/api/registrations.ts

// --- Interfaces (Assuming these are defined correctly based on your needs) ---
interface ClassInRegistration {
    id: number;
    name: string;
    schedule: string;
    instructorName: string;
    duration: number;
    classType: string;
}
interface UserRegistration {
    id: number;
    userId: number;
    classId: number;
    createdAt: string;
    class: ClassInRegistration;
}

// --- API Base URL ---
const API_BASE_URL = 'http://localhost:3001'; // Ensure this matches your backend

// --- Fetch User's Registrations (Existing Function) ---
export const getMyRegistrations = async (token: string): Promise<UserRegistration[]> => {
    if (!token) throw new Error("Authentication token is required.");
    try {
        const response = await fetch(`${API_BASE_URL}/api/registrations/my`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        return await response.json() as UserRegistration[];
    } catch (error) {
        console.error("API call failed: getMyRegistrations", error);
        throw error;
    }
};

// --- Cancel Registration Function (ADDED/MODIFIED Section) ---
/**
 * Cancels a specific registration for the authenticated user.
 * @param registrationId - The ID of the registration record to cancel.
 * @param token - The user's JWT authentication token.
 * @returns Promise<void> - Resolves on success (HTTP 204), throws error on failure.
 */
export const cancelRegistration = async (registrationId: number, token: string): Promise<void> => {
    // Input validation
    if (!token) {
        throw new Error("Authentication token is required to cancel registration.");
    }
    if (typeof registrationId !== 'number' || registrationId <= 0) {
         throw new Error("A valid Registration ID is required to cancel.");
    }

    try {
        // Make the DELETE request to the backend endpoint
        const response = await fetch(`${API_BASE_URL}/api/registrations/${registrationId}`, {
            method: 'DELETE', // Specify the HTTP method
            headers: {
                'Authorization': `Bearer ${token}`, // Include the authentication token
                // No 'Content-Type' or 'body' needed for this DELETE request
            },
        });

        // Check if the response indicates success (204 No Content is ideal for DELETE)
        // Also treat other 2xx statuses as success if the backend might return them differently
        if (!response.ok) {
             // If not OK, try to parse error message from backend
            let errorData = { error: `Request failed with status: ${response.status}` }; // Default error
            try {
                 errorData = await response.json();
            } catch (e) {
                 console.warn("Could not parse JSON error response for cancellation.");
            }
             // Throw an error using the backend message or the status text
            throw new Error(errorData.error || response.statusText || `HTTP error! Status: ${response.status}`);
        }

        // If response.ok is true (e.g., 200, 204), the operation was successful.
        // No return value needed for void Promise.
        return;

    } catch (error) {
        // Log the error and re-throw it for the calling component
        console.error(`API call failed: cancelRegistration for ID ${registrationId}`, error);
        throw error;
    }
};
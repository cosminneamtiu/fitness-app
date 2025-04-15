// client/src/api/classes.ts

// --- Define Base Interface for Fitness Class Data ---
// This should align with the data returned by BOTH getAllClasses and getSingleClass
interface FitnessClass {
    id: number;
    name: string;
    description: string;
    instructorName: string;
    schedule: string; // ISO Date string
    duration: number;
    capacity: number;
    location?: string | null;
    difficulty: string;
    classType: string;
    createdAt: string; // ISO Date string
    // Add optional _count field (returned by backend for both endpoints now)
    _count?: {
        registrations: number;
    };
}

// --- Define other necessary interfaces ---
interface RegistrationData {
    classId: number;
}
interface RegistrationResponse {
    message: string;
    registration: {
        id: number;
        userId: number;
        classId: number;
        createdAt: string;
    }
}

// --- API Base URL ---
const API_BASE_URL = 'http://localhost:3001'; // Ensure this matches your backend server port

// --- Fetch All Classes Function (Existing) ---
/**
 * Fetches all available fitness classes from the backend.
 * @returns Promise<FitnessClass[]> - A promise that resolves to an array of fitness classes.
 */
export const getAllClasses = async (): Promise<FitnessClass[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/classes`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        return await response.json() as FitnessClass[];
    } catch (error) {
        console.error("API call failed: getAllClasses", error);
        throw error;
    }
};

// --- Register for Class Function (Existing) ---
/**
 * Registers the logged-in user for a specific class.
 * @param registrationData - The data required for registration (e.g., classId).
 * @param token - The JWT authentication token for the logged-in user.
 * @returns Promise<RegistrationResponse> - A promise resolving to the success response.
 */
export const registerForClass = async (registrationData: RegistrationData, token: string): Promise<RegistrationResponse> => {
     if (!token) throw new Error("Authentication token required.");
     if (!registrationData || typeof registrationData.classId !== 'number') throw new Error("Valid Class ID required.");
    try {
        const response = await fetch(`${API_BASE_URL}/api/classes/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(registrationData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! Status: ${response.status}`);
        }
        return data as RegistrationResponse;
    } catch (error) {
         console.error("API call failed: registerForClass", error);
         throw error;
    }
};


// --- Fetch Single Class Function (ADDED/MODIFIED Section) ---
/**
 * Fetches details for a single fitness class by its ID.
 * @param classId - The ID of the class to fetch.
 * @returns Promise<FitnessClass> - A promise resolving to the detailed class object.
 */
export const getSingleClass = async (classId: number): Promise<FitnessClass> => {
    // Validate input
    if (isNaN(classId) || classId <= 0) {
        throw new Error("A valid Class ID must be provided to fetch details.");
    }
    try {
        // Make GET request to the specific class endpoint
        const response = await fetch(`${API_BASE_URL}/api/classes/${classId}`);

        // Handle non-successful responses (e.g., 404 Not Found, 500 Server Error)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse server error response' }));
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }

        // Parse the successful JSON response
        const data = await response.json();
        // Assume the data matches the FitnessClass interface (including _count)
        return data as FitnessClass;

    } catch (error) {
        // Log the error and re-throw it for the component to handle
        console.error(`API call failed: getSingleClass for ID ${classId}`, error);
        throw error;
    }
};
// client/src/pages/ClassesPage.tsx
import React, { useState, useEffect } from 'react';
import { getAllClasses, registerForClass } from '../api/classes';
import { useAuth } from '../context/AuthContext';
// Import Link and useNavigate
import { Link, useNavigate } from 'react-router-dom';
import './ClassesPage.css';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';

const classImages: { [key: number]: string } = {
    1: img1,
    2: img2,
    3: img3,
    4: img4,
    5: img5,
  };

// Define interface matching FitnessClass from api/classes.ts
interface FitnessClassDisplay {
    id: number;
    name: string;
    description: string;
    instructorName: string;
    schedule: string;
    duration: number;
    classType: string;
    capacity: number;
    location?: string | null;
    difficulty: string;
    _count?: { // Include optional count
        registrations: number;
    };
}

function ClassesPage() {
    const [classes, setClasses] = useState<FitnessClassDisplay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [registrationFeedback, setRegistrationFeedback] = useState<{ [key: number]: { type: 'success' | 'error', message: string } }>({});
    const { isAuthenticated, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getAllClasses();
                setClasses(data);
            } catch (apiError: any) {
                setError(apiError.message || 'Failed to load classes.');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const handleRegisterClick = async (classId: number) => {
        if (!isAuthenticated || !token) {
            navigate('/login', { state: { message: "Please log in to register." } });
            return;
        }
        setRegistrationFeedback(prev => ({ ...prev, [classId]: undefined! }));
        try {
            const response = await registerForClass({ classId }, token);
            setRegistrationFeedback(prev => ({ ...prev, [classId]: { type: 'success', message: response.message } }));
            // Optional: Refetch classes to update counts, or update local state if counts are present
             setClasses(prevClasses => prevClasses.map(cls =>
                 cls.id === classId ? { ...cls, _count: { registrations: (cls._count?.registrations ?? 0) + 1 } } : cls
             ));
        } catch (apiError: any) {
            setRegistrationFeedback(prev => ({ ...prev, [classId]: { type: 'error', message: apiError.message || 'Registration failed.' } }));
        }
    };

    return (
        <div>
            <h1>Available Classes</h1>
            {loading && <p>Loading available classes...</p>}
            {error && <p className="feedback-message error">Error: {error}</p>}
            {!loading && !error && (
                <div className="classes-list"> {/* Add className for styling */}
                    {classes.length > 0 ? (
                        classes.map((cls) => {
                            const currentRegs = cls._count?.registrations ?? 0;
                            const isFull = currentRegs >= cls.capacity;
                            // Add logic here later to check if *user* is registered
                            const isUserRegistered = false; // Placeholder
                            const canRegister = isAuthenticated && !isFull && !isUserRegistered;
                            const imageSrc = classImages[cls.id];



                            return (
                                <div key={cls.id} className="class-card">
                                    <div className="class-card-content">
                                    <img
                                    src={imageSrc}
                                    alt={`${cls.name} thumbnail`}
                                    className="class-card-image"
                                    />
                                        <div className="class-card-details">
                                        <h2>{cls.name}</h2>
                                        <p><strong>Type:</strong> {cls.classType} | <strong>Difficulty:</strong> {cls.difficulty}</p>
                                        <p><strong>Instructor:</strong> {cls.instructorName}</p>
                                        <p><strong>Schedule:</strong> {new Date(cls.schedule).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} ({cls.duration} mins)</p>
                                        {cls.location && <p><strong>Location:</strong> {cls.location}</p>}
                                        <p><strong>Spots Available:</strong> {cls.capacity - (cls._count?.registrations ?? 0)} / {cls.capacity}</p>
                                        <p style={{ fontStyle: 'italic', color: 'var(--fb-color-text-secondary)' }}>
                                            {cls.description.substring(0, 150)}...
                                        </p>

                                        <div className="list-item-actions">
                                            <Link to={`/classes/${cls.id}`} className="button details-button">
                                            View Details
                                            </Link>
                                            {isAuthenticated && (
                                            <button
                                                onClick={() => handleRegisterClick(cls.id)}
                                                disabled={isFull || isUserRegistered}
                                                className="register-button"
                                            >
                                                {isFull ? 'Full' : isUserRegistered ? 'Registered' : 'Register'}
                                            </button>
                                            )}
                                            {registrationFeedback[cls.id] && (
                                            <p className={`feedback-message ${registrationFeedback[cls.id].type}`}>
                                                {registrationFeedback[cls.id].message}
                                            </p>
                                            )}
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No classes are currently available.</p>
                    )}
                </div>
            )}
        </div>
    );
}
export default ClassesPage;
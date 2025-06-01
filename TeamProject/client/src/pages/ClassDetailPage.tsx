// client/src/pages/ClassDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { getSingleClass, registerForClass } from '../api/classes';
import { useAuth } from '../context/AuthContext';

import './ClassDetailPage.css';

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
  _count?: {
    registrations: number;
  };
}

function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [classData, setClassData] = useState<FitnessClassDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationFeedback, setRegistrationFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    const numericClassId = Number(classId);
    if (!classId || isNaN(numericClassId)) {
      setError('Invalid Class ID.');
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
      } catch (apiError: any) {
        setError(apiError.message || 'Failed to load class details.');
        console.error('Fetch class detail error:', apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [classId]);

  const handleRegister = async () => {
    const numericClassId = Number(classId);
    if (!isAuthenticated || !token || !classData) {
      navigate('/login', {
        state: { from: location, message: 'Please log in to register.' },
      });
      return;
    }

    const currentRegistrations = classData._count?.registrations ?? 0;
    if (currentRegistrations >= classData.capacity) {
      setRegistrationFeedback({
        type: 'error',
        message: 'Sorry, this class is already full.',
      });
      return;
    }

    try {
      setRegistrationFeedback(null);
      const response = await registerForClass({ classId: numericClassId }, token);
      setRegistrationFeedback({
        type: 'success',
        message: response.message || 'Successfully registered!',
      });
      setClassData((prev) =>
        prev
          ? {
              ...prev,
              _count: {
                registrations: (prev._count?.registrations ?? 0) + 1,
              },
            }
          : null
      );
    } catch (apiError: any) {
      setRegistrationFeedback({
        type: 'error',
        message: apiError.message || 'Registration failed.',
      });
    }
  };

  // Back button handler
  const handleBackClick = () => {
    navigate('/classes');
  };

  if (loading) return <p>Loading class details...</p>;

  if (error)
    return (
      <div className="feedback-message error">
        Error: {error}. <Link to="/classes">Back to Classes</Link>
      </div>
    );

  if (!classData)
    return (
      <p>
        Class not found. <Link to="/classes">Back to Classes</Link>
      </p>
    );

  const currentRegistrations = classData._count?.registrations ?? 0;
  const spotsRemaining = Math.max(0, classData.capacity - currentRegistrations);
  const isFull = spotsRemaining === 0;
  const isUserRegistered = false;
  const canRegister = !isFull && !isUserRegistered;

  return (
    <div className="class-detail-container">
      <div className="class-detail-page">

        <nav aria-label="breadcrumb">
          <Link to="/classes">Classes</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{classData.name}</span>
        </nav>

        <div className="class-content">
          <div className="class-info">
            <h1>{classData.name}</h1>
            <p className="subheading">
              {classData.classType} | {classData.difficulty} | {classData.duration} minutes
            </p>

            <div className="details-section">
              <p>
                <strong>Instructor:</strong> {classData.instructorName}
              </p>
              <p>
                <strong>When:</strong>{' '}
                {new Date(classData.schedule).toLocaleString([], {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </p>
              {classData.location && (
                <p>
                  <strong>Location:</strong> {classData.location}
                </p>
              )}
              <p>
                <strong>Availability:</strong> {spotsRemaining} spot(s) remaining out of{' '}
                {classData.capacity}
                {isFull && (
                  <span style={{ fontWeight: 'bold', color: '#dc3545' }}> (Full)</span>
                )}
              </p>
              <p style={{ marginTop: '1rem' }}>
                <strong>Description:</strong>
              </p>
              <p>{classData.description}</p>
            </div>

            <div className="details-section">
              <h3>Register for this Class</h3>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={handleRegister}
                    disabled={!canRegister}
                    className="detailRegister"
                  >
                    {isFull ? 'Class Full' : isUserRegistered ? 'Already Registered' : 'Register Now'}
                  </button>
                  {registrationFeedback && (
                    <p className={`feedback-message ${registrationFeedback.type}`}>
                      {registrationFeedback.message}
                    </p>
                  )}
                </div>
              ) : (
                <p>
                  Please{' '}
                  <Link
                    to="/login"
                    state={{
                      from: location,
                      message: 'Please log in to register for this class.',
                    }}
                  >
                    log in
                  </Link>{' '}
                  or <Link to="/register">create an account</Link> to register.
                </p>
              )}
              <button onClick={handleBackClick} className="backButtonFixed">
                Back to Classes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailPage;

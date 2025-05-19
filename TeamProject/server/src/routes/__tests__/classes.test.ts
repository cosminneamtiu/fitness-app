// server/src/routes/__tests__/classes.test.ts
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

// --- Import the app instance from app.ts ---
import app from '../../app'; // 👈 Correct import path

const prisma = new PrismaClient();

// --- Mock Middleware if needed ---
// If authenticateToken actually verifies a real token, you need to mock it for protected routes
// vi.mock('../../middleware/auth', () => ({
//   // Mock implementation: always calls next() and attaches a fake user
//   authenticateToken: vi.fn((req, res, next) => {
//     req.user = { userId: 123 }; // Attach a fake user object
//     next();
//   }),
// }));
// --- End Mock Middleware ---


describe('GET /api/classes', () => {
    // ... (keep your beforeAll/afterAll if using test DB seeding) ...

    it('should return status 200 and an array of classes', async () => {
        const response = await request(app) // Use the imported app
          .get('/api/classes')
          .expect('Content-Type', /json/)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // ... more assertions ...
    });
});

describe('POST /api/classes/signup', () => {
    it('should require authentication (return 401 if middleware not mocked/token not sent)', async () => {
         await request(app)
            .post('/api/classes/signup')
            .send({ classId: 999 }) // Use an ID likely not existing or irrelevant here
            .expect(401); // If authenticateToken is NOT mocked, this expects 401
            // If authenticateToken IS mocked as above, this might return 404/500 depending on logic,
            // so adjust expectation or test token sending properly.
    });

     // Add tests for successful signup (requires sending a token or mocking middleware effectively)
     // it('should allow a user to sign up for a class', async () => { ... });
});

// ... rest of your tests ...
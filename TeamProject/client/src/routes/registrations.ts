// server/src/routes/registrations.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth'; // Ensure path to middleware is correct

const router = express.Router();
const prisma = new PrismaClient();

// --- GET /api/registrations/my ---
// (Existing code to fetch user's registrations - Assuming this is already correct)
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  if (!userId) return res.status(401).json({ error: "User ID not found." });
  try {
    const myRegistrations = await prisma.registration.findMany({
      where: { userId: userId },
      include: {
        class: true, // Include related class details
      },
      orderBy: {
        class: {
            schedule: 'asc' // Order by class schedule
        }
      }
    });
    res.json(myRegistrations);
  } catch (error) {
    console.error("Failed to fetch user's registrations:", error);
    res.status(500).json({ error: "Failed to fetch your registered classes" });
  }
});


// --- DELETE /api/registrations/:registrationId ---  (ADDED/MODIFIED Section)
// Allows the authenticated user to delete their own registration record.
router.delete('/:registrationId', authenticateToken, async (req: Request, res: Response) => {
  // Get the user ID from the authenticated token payload
  const userId = (req as any).user.userId;
  // Get the registration ID from the URL parameters
  const { registrationId } = req.params;

  // Validate that registrationId is a number
  const numericRegId = Number(registrationId);
  if (isNaN(numericRegId)) {
    return res.status(400).json({ error: 'Invalid registration ID format.' });
  }

  // Validate that userId was actually extracted from the token
  if (!userId) {
     return res.status(401).json({ error: "Authentication error: User ID missing." });
  }


  try {
    // Step 1: Verify the registration exists and belongs to the requesting user
    const registrationToDelete = await prisma.registration.findUnique({
      where: {
        id: numericRegId, // Find by the primary key of the Registration table
      },
    });

    // Case 1: Registration doesn't exist
    if (!registrationToDelete) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    // Case 2: Registration exists but belongs to a different user
    if (registrationToDelete.userId !== userId) {
      // Return 403 Forbidden because the user is authenticated but not authorized for this resource
      return res.status(403).json({ error: 'You are not authorized to cancel this registration.' });
    }

    // Step 2: If checks pass, delete the registration record
    await prisma.registration.delete({
      where: {
        id: numericRegId,
        // Including userId again in the where clause is optional but adds an extra layer of safety
        // userId: userId,
      },
    });

    // Step 3: Send a success response with no content (standard for DELETE)
    res.status(204).send();

  } catch (error: any) {
     // Handle specific Prisma errors, like if the record was deleted between the find and delete calls
     if (error.code === 'P2025') { // Prisma code for "Record to delete does not exist."
         return res.status(404).json({ error: 'Registration not found or already cancelled.' });
     }
    // Handle generic errors
    console.error(`Failed to cancel registration ${registrationId}:`, error);
    res.status(500).json({ error: 'An unexpected error occurred while cancelling registration.' });
  }
});


export default router; // Export the router
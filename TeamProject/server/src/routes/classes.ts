// server/src/routes/classes.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth'; // Ensure path to middleware is correct

const router = express.Router();
const prisma = new PrismaClient();

// --- GET /api/classes ---
// Fetches all available fitness classes, optionally including registration counts.
router.get('/', async (req: Request, res: Response) => {
  try {
    const classes = await prisma.fitnessClass.findMany({
      include: {
        // Include the count of registrations for each class
        _count: { select: { registrations: true } }
      },
      orderBy: {
        schedule: 'asc', // Order classes by their scheduled time, earliest first
      },
    });
    res.json(classes); // Send the fetched classes as a JSON response
  } catch (error) {
    console.error('Failed to fetch classes:', error);
    res.status(500).json({ error: 'Failed to fetch fitness classes' });
  }
});

// --- GET /api/classes/:id ---  (ADDED/MODIFIED Section)
// Fetches details for a single class by its ID, including registration count.
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params; // Get the class ID from the URL parameter

  // Validate that the ID is a number
  const numericId = Number(id);
  if (isNaN(numericId)) {
    return res.status(400).json({ error: 'Invalid class ID format.' });
  }

  try {
    // Fetch the specific class by its unique ID
    const singleClass = await prisma.fitnessClass.findUnique({
      where: {
        id: numericId,
      },
      include: {
        // Include the count of related registration records
        _count: {
          select: { registrations: true },
        },
      },
    });

    // If no class is found with the given ID
    if (!singleClass) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    // Send the found class data (including _count) as JSON response
    res.json(singleClass);

  } catch (error) {
    // Handle any potential errors during database query
    console.error(`Failed to fetch class ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch class details.' });
  }
});


// --- POST /api/classes/signup ---
// (Existing code - Assumed correct from previous steps)
router.post('/signup', authenticateToken, async (req: Request, res: Response) => {
    const { classId } = req.body;
    const userId = (req as any).user.userId;

    if (classId === undefined || classId === null) return res.status(400).json({ error: 'Class ID is required' });
    const numericClassId = Number(classId);
    if (isNaN(numericClassId)) return res.status(400).json({ error: 'Invalid Class ID format' });
    if (!userId) return res.status(401).json({ error: "Authentication error." });

    try {
        const fitnessClass = await prisma.fitnessClass.findUnique({
            where: { id: numericClassId },
            include: { _count: { select: { registrations: true } } },
        });

        if (!fitnessClass) return res.status(404).json({ error: 'Class not found' });
        if (fitnessClass._count.registrations >= fitnessClass.capacity) return res.status(400).json({ error: 'Class is full' });

        const existingRegistration = await prisma.registration.findUnique({
            where: { userId_classId: { userId: userId, classId: numericClassId } }
        });
        if (existingRegistration) return res.status(400).json({ error: 'You are already registered for this class' });

        const newRegistration = await prisma.registration.create({
            data: { userId: userId, classId: numericClassId },
        });
        res.status(201).json({ message: 'Successfully registered for class', registration: newRegistration });

    } catch (error: any) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Database constraint violation (already registered?).' });
        console.error(`Failed to register for class ${classId}:`, error);
        res.status(500).json({ error: 'Failed to register for class' });
    }
});


export default router;
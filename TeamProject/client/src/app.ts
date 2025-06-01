// server/src/app.ts
import express from 'express';
import cors from 'cors';

// Import Route Handlers
import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import registrationRoutes from './routes/registrations';
// Import middleware if needed globally here
// import { yourGlobalMiddleware } from './middleware/yourMiddleware';

// --- Create Express App Instance ---
const app = express();

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies
// app.use(yourGlobalMiddleware); // Example

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/registrations', registrationRoutes);

// --- Basic Error Handler (Example - can be more sophisticated) ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Error:", err.stack || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// --- Export the configured app instance ---
export default app;
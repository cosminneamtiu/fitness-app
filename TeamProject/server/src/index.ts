// server/src/index.ts
import express from 'express';
import cors from 'cors';
import app from './app'; // 

// Import Route Handlers
import authRoutes from './routes/auth';
import classRoutes from './routes/classes';
import registrationRoutes from './routes/registrations'; // 👈 Import the new registrations router

// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 3001; // Use environment variable or default port

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies

// --- API Routes ---
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/classes', classRoutes); // Mount class-related routes
app.use('/api/registrations', registrationRoutes); // 👈 Mount registration-related routes

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
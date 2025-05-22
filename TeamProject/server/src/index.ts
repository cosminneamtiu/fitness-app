// server/src/index.ts
import dotenv from 'dotenv';
dotenv.config(); // Load .env variables FIRST - Ensure dotenv is installed (npm install dotenv)

// Import the configured Express app instance from app.ts
import expressApp from './app';

// --- Server Startup ---
const PORT = process.env.PORT || 3001; // Get port from environment or use default

// Start the server and listen on the specified port
// This part runs only when you execute `node dist/index.js` or `ts-node src/index.ts` etc.
// It won't run when 'app' is merely imported by test files.
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});

// No need to export anything from here usually

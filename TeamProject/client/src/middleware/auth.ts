/*import jwt, { JwtPayload as VerifiedJwtPayload } from 'jsonwebtoken'; // Import type from jwt library
import { Request, Response, NextFunction } from 'express';

// Ensure JWT_SECRET is checked at application startup as shown previously
const secret = process.env.JWT_SECRET as string;

// Assuming you have the type definition file (e.g., src/types/express/index.d.ts)
// augmenting the Express.Request interface with the 'user' property
// using the 'JwtPayload' interface defined there.

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  // Optional: More robust splitting
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // Use 401 Unauthorized for missing credentials/token
    return res.status(401).json({ message: 'Access token is missing or Bearer schema required' });
  }

  jwt.verify(token, secret, (err, decodedPayload) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); // Log for debugging
      // Use 403 Forbidden for invalid/expired token issues
      return res.status(403).json({ message: 'Token is invalid or expired' });
    }

    // Assign the decoded payload to req.user.
    // TypeScript should now recognize req.user if augmentation is set up correctly.
    // We cast because jwt.verify returns string | JwtPayload | undefined
    req.user = decodedPayload as VerifiedJwtPayload & { userId: number }; // Be specific about expected payload shape

    next(); // Proceed to the next middleware or route handler
  });
};

*/

// server/src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secret = process.env.JWT_SECRET || 'dev-secret'; // Make sure this matches the signing secret!

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('--- Authenticate Token Middleware ---'); // Log entry

  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log the raw header

  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  console.log('Extracted Token:', token); // Log the extracted token

  if (!token) {
    console.log('Middleware: No token found, sending 401.');
    return res.status(401).json({ message: 'Access token is missing or Bearer schema required' });
  }

  console.log('Middleware: Verifying token with secret:', secret); // Log the secret being used

  jwt.verify(token, secret, (err, decodedPayload) => {
    if (err) {
      console.error('Middleware: JWT Verification Error:', err.message); // Log the specific error
      console.log('Middleware: Verification failed, sending 403.');
      // Don't send error details to client generally, but useful for debugging:
      // return res.status(403).json({ message: 'Token is invalid or expired', error: err.message });
      return res.sendStatus(403); // Send Forbidden status
    }

    // Token is valid
    console.log('Middleware: Token verified successfully. Decoded Payload:', decodedPayload);

    // Attach payload to request object (ensure type augmentation is working)
    // Make sure your augmentation includes 'userId' or adjust here
    (req as any).user = decodedPayload; // Cast to any or use proper type augmentation

    console.log('Middleware: Attached user to request:', (req as any).user);
    console.log('--- Middleware Finished Successfully ---');
    next(); // Proceed to the next middleware or route handler
  });
};
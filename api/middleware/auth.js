import jwt from 'jsonwebtoken';

/**
 * Middleware to verify a JSON Web Token (JWT).
 * This function will protect API routes by checking for a valid token in the Authorization header.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: 'Bearer TOKEN'

  if (token == null) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      return res.status(403).json({ error: 'Token is not valid.' });
    }
    req.user = user;
    next();
  });
}
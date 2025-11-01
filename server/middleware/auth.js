const jwt = require('jsonwebtoken');

/**
 * Middleware to verify a JSON Web Token (JWT).
 * This function will protect API routes by checking for a valid token in the Authorization header.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 */
function verifyToken(req, res, next) {
  // TODO: Implement JWT verification logic.
  // 1. Get the token from the `Authorization` header (it should be in the format 'Bearer <token>').
  // 2. Check if the token exists. If not, return a 403 Forbidden error.
  // 3. Use `jwt.verify()` to decode and verify the token using your `JWT_SECRET` from `.env`.
  // 4. If verification is successful, attach the decoded payload (which should contain user info) to `req.user`.
  // 5. Call `next()` to pass control to the next handler (the actual API logic).
  // 6. If verification fails, return a 401 Unauthorized error.

  // --- Placeholder Logic ---
  console.log('Executing verifyToken middleware (currently a placeholder).');
  // For development, we can attach a mock user object.
  // In production, this must be replaced with real JWT validation.
  req.user = { id: 'placeholder:user:123', message: 'This user comes from the placeholder middleware.' };
  next();
  // --- End Placeholder Logic ---
}

module.exports = {
  verifyToken,
};

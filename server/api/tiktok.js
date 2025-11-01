// This file will contain the logic for interacting with the TikTok API.

/**
 * Fetches basic information for the authenticated user.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
async function getUserInfo(req, res) {
  // TODO: Implement the logic to fetch user info from TikTok.
  // 1. Get the user's ID from `req.user`.
  // 2. Retrieve the user's TikTok access token from the database.
  // 3. Make a GET request to the TikTok API `/v2/user/info/` endpoint, passing the
  //    access token and specifying the required fields (e.g., open_id, display_name, avatar_url).
  // 4. Handle the response from the TikTok API.
  // 5. Send the user data or an error response back to the client.

  console.log('User from JWT:', req.user);

  res.status(501).json({ message: 'Not Implemented: getUserInfo' });
}

module.exports = {
  getUserInfo,
};

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');

/**
 * Reads the content of the database file.
 * If the file doesn't exist, it returns an empty object.
 * @returns {Promise<object>} The parsed database content.
 */
async function readDb() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, which is fine. Initialize with an empty state.
      return { users: {} };
    }
    // For other errors, re-throw them.
    throw error;
  }
}

/**
 * Writes the given data to the database file.
 * @param {object} data - The data object to write to the file.
 * @returns {Promise<void>}
 */
async function writeDb(data) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Finds a user by their provider and profile ID, or creates a new one.
 * It also stores or updates their access and refresh tokens.
 * @param {object} params - The user data from Passport.js.
 * @param {object} params.profile - The profile object from Passport.js.
 * @param {string} params.accessToken - The OAuth access token.
 * @param {string} [params.refreshToken] - The OAuth refresh token (optional).
 * @returns {Promise<object>} The found or created user object.
 */
export async function findOrCreateUser({ profile, accessToken, refreshToken }) {
  const db = await readDb();
  
  const provider = profile.provider;
  const profileId = profile.id;
  const userKey = `${provider}:${profileId}`;

  let user = db.users[userKey];

  if (user) {
    // User exists, update their tokens and last login time
    console.log(`Updating existing user: ${userKey}`);
    user.tokens.accessToken = accessToken;
    if (refreshToken) {
      user.tokens.refreshToken = refreshToken;
    }
    user.lastLoginAt = new Date().toISOString();
  } else {
    // User doesn't exist, create a new entry
    console.log(`Creating new user: ${userKey}`);
    user = {
      id: userKey,
      provider: provider,
      profileId: profileId,
      displayName: profile.displayName,
      email: profile.emails ? profile.emails[0].value : null,
      photo: profile.photos ? profile.photos[0].value : null,
      profileJson: profile._json,
      tokens: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  }

  db.users[userKey] = user;
  await writeDb(db);
  
  return user;
}
// A functional Node.js/Express server for multi-platform authentication.
// To use this:
// 1. In the 'server/' directory, run 'npm install' to get the dependencies from package.json.
// 2. Create a 'secrets' directory in the project root, and a '.env' file inside it (e.g., /secrets/.env).
// 3. Follow the instructions below to get API credentials for each platform.
// 4. Add all credentials to your .env file.
// 5. Run the server with 'node auth.js'.

/*
--------------------------------------------------------------------------------
Setup Instructions & .env Configuration
--------------------------------------------------------------------------------
Create a file named '.env' in a 'secrets/' directory at the project root (e.g., your-project/secrets/.env).
Add the following key-value pairs, replacing the placeholder values with your actual credentials.

PORT=3001
SESSION_SECRET=a_very_secret_key_for_sessions_that_is_long_and_random
JWT_SECRET=another_super_secret_key_for_jwt

# Facebook Credentials
... (rest of instructions are the same)
--------------------------------------------------------------------------------
*/

import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { findOrCreateUser } from './database.js';
import fs from 'fs';
import os from 'os';

// API and Middleware imports
import { verifyToken } from './middleware/auth.js';
import * as metaApi from './api/meta.js';
import * as twitterApi from './api/twitter.js';
import * as linkedinApi from './api/linkedin.js';
import * as tiktokApi from './api/tiktok.js';

// Passport Strategies
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TikTokStrategy } from 'passport-tiktok-auth';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables. Prioritize user-specific path on Windows.
const userEnvPath = 'F:\\Codebase\\EnvSetup\\cred\\.env\\OpenExpress\\.env';
const projectEnvPath = path.resolve(__dirname, '..', 'secrets', '.env');

let envPathToUse;
let loadedPathMessage;
if (os.platform() === 'win32' && fs.existsSync(userEnvPath)) {
    envPathToUse = userEnvPath;
    loadedPathMessage = `Loaded .env from user-specified path: ${userEnvPath}`;
} else if (fs.existsSync(projectEnvPath)) {
    envPathToUse = projectEnvPath;
    loadedPathMessage = `Loaded .env from project secrets: ${projectEnvPath}`;
} else {
    loadedPathMessage = "Warning: No .env file found in standard locations. Using system environment variables.";
}

if (envPathToUse) {
    dotenv.config({ path: envPathToUse });
} else {
    dotenv.config(); // Load from system env
}


const app = express();
const PORT = process.env.PORT || 3001;

// --- Helper Functions ---
const verifyCallback = (platform) => async (accessToken, refreshToken, profile, done) => {
    console.log(`Successfully authenticated with ${platform}:`);
    console.log(`Profile ID: ${profile.id}, Display Name: ${profile.displayName}`);
    try {
        const user = await findOrCreateUser({
            profile,
            accessToken,
            refreshToken,
        });
        return done(null, user);
    } catch (err) {
        console.error(`Error during findOrCreateUser for ${platform}:`, err);
        return done(err, null);
    }
};

const generateAndSendToken = (req, res, platform) => {
    const userPayload = { 
        id: req.user.id, 
        displayName: req.user.displayName,
        provider: req.user.provider
    };
    
    const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const message = 'Authentication Successful!';
    res.status(200).send(`
      <script>
        window.opener.postMessage({ type: 'auth-success', platform: '${platform}', token: '${token}' }, '*');
        window.close();
      </script>
      <h1>${message}</h1>
      <p>You can close this window.</p>
    `);
};

const sendAuthFailure = (res, platform) => {
    const message = 'Authentication Failed';
    res.status(401).send(`
        <script>
            window.opener.postMessage({ type: 'auth-failure', platform: '${platform}' }, '*');
            window.close();
        </script>
        <h1>${message}</h1>
        <p>Please try again. You can close this window.</p>
    `);
}


// --- Configuration & Middleware ---
app.use(cors({ origin: '*', credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS in production
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json()); // Middleware to parse JSON bodies for API endpoints

// --- Passport General Setup ---
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


// --- Passport Strategies Setup ---
// ... (Passport strategy setups remain the same) ...
if (process.env.FACEBOOK_APP_ID) {
  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    }, verifyCallback('facebook')));
}
if (process.env.TWITTER_CONSUMER_KEY) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/twitter/callback`,
    includeEmail: true
  }, verifyCallback('twitter')));
}
if (process.env.LINKEDIN_CLIENT_ID) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `http://localhost:${PORT}/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
  }, verifyCallback('linkedin')));
}
if (process.env.TIKTOK_CLIENT_KEY) {
  passport.use(new TikTokStrategy({
    clientID: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    scope: ['user.info.basic'],
    callbackURL: `http://localhost:${PORT}/auth/tiktok/callback`
  }, verifyCallback('tiktok')));
}


// --- OAuth Authentication Routes ---

app.get('/', (req, res) => res.send('OpenExpress Node.js Authentication Server is running!'));

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failed/facebook', session: false }),
  (req, res) => generateAndSendToken(req, res, 'meta')
);
app.get('/auth/failed/facebook', (req, res) => sendAuthFailure(res, 'meta'));

// X (Twitter)
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/auth/failed/twitter', session: false }),
  (req, res) => generateAndSendToken(req, res, 'x')
);
app.get('/auth/failed/twitter', (req, res) => sendAuthFailure(res, 'x'));

// LinkedIn
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME_STATE' }));
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/auth/failed/linkedin', session: false }),
  (req, res) => generateAndSendToken(req, res, 'linkedin')
);
app.get('/auth/failed/linkedin', (req, res) => sendAuthFailure(res, 'linkedin'));

// TikTok
app.get('/auth/tiktok', passport.authenticate('tiktok'));
app.get('/auth/tiktok/callback',
  passport.authenticate('tiktok', { failureRedirect: '/auth/failed/tiktok', session: false }),
  (req, res) => generateAndSendToken(req, res, 'tiktok')
);
app.get('/auth/failed/tiktok', (req, res) => sendAuthFailure(res, 'tiktok'));


// --- Secure API Routes ---
// These routes should be protected by your JWT middleware.

// Meta (Facebook/Instagram) API Routes
app.post('/api/meta/page/video', verifyToken, metaApi.postVideoToPage);
app.post('/api/meta/group/video', verifyToken, metaApi.postVideoToGroup);

// X (Twitter) API Routes
app.post('/api/twitter/tweet', verifyToken, twitterApi.postTweet);

// LinkedIn API Routes
app.post('/api/linkedin/profile/post', verifyToken, linkedinApi.postToProfile);

// TikTok API Routes
app.get('/api/tiktok/user', verifyToken, tiktokApi.getUserInfo);

// --- Global Error Handler ---
// This must be the LAST middleware added.
app.use((err, req, res, next) => {
  console.error('--- Unhandled Node.js Error ---');
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error(`Route: ${req.method} ${req.originalUrl}`);
  console.error(err.stack);
  console.error('--------------------------------');
  
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Node.js auth server listening on http://localhost:${PORT}`);
  console.log(loadedPathMessage);
  if (!process.env.SESSION_SECRET) {
      console.warn("WARNING: SESSION_SECRET is not set. Please set it in your .env file for security.");
  }
  if (!process.env.JWT_SECRET) {
      console.warn("WARNING: JWT_SECRET is not set. Please set it in your .env file for security.");
  }
});
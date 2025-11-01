# Test Plan: Posting a Tweet

- **Scope(s) Required:** `tweet.write`
- **Endpoint:** `/2/tweets`
- **Method:** `POST`
- **Prerequisites:** User must grant `tweet.write` permission.
- **Test Steps:**
  1. Authenticate user via OAuth 2.0 PKCE.
  2. Present UI for user to compose a tweet.
  3. Make a POST request to the Twitter API v2 endpoint.
  4. Verify the tweet appears on the user's profile.

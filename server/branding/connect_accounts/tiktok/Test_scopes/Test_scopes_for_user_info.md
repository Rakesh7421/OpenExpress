# Test Plan: Fetching User Info from TikTok

- **Scope(s) Required:** `user.info.basic`
- **Endpoint:** `/v2/user/info/`
- **Method:** `GET`
- **Prerequisites:** User must grant `user.info.basic` permission.
- **Test Steps:**
  1. Authenticate user via OAuth 2.0.
  2. Make a GET request to the user info endpoint with the access token.
  3. Verify the correct user profile data (display name, avatar, etc.) is returned.

export const content = `# Test Plan: Posting to LinkedIn Profile

- **Scope(s) Required:** \`w_member_social\`
- **Endpoint:** \`/v2/ugcPosts\`
- **Method:** \`POST\`
- **Prerequisites:** User must grant \`w_member_social\` permission.
- **Test Steps:**
  1. Authenticate user via OAuth 2.0.
  2. Present UI for user to compose a post (text, image, or link).
  3. Make a POST request to the UGC Posts API.
  4. Verify the post appears on the user's LinkedIn feed.`;
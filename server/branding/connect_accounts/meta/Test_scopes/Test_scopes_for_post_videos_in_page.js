export const content = `# Test Plan: Posting Videos to a Facebook Page

- **Scope(s) Required:** \`pages_manage_posts\`, \`pages_read_engagement\`
- **Endpoint:** \`/{page-id}/videos\`
- **Method:** \`POST\`
- **Prerequisites:** User must grant permissions for a page they manage.
- **Test Steps:**
  1. Authenticate user and acquire a Page Access Token with the required scopes.
  2. Present UI for user to select a video file and enter a description.
  3. Make a POST request to the Graph API endpoint.
  4. Verify the video appears on the target Facebook Page.`;
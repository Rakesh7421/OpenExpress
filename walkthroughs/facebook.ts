export const content = `
# Facebook-Specific Configuration

After following the main **Shared Meta App Setup Guide** to get your App ID and Secret, ensure the following settings are correct for a standard Facebook Page or Group integration.

## 1. Valid OAuth Redirect URI

In your Meta App settings under **Facebook Login > Settings**, ensure the **Valid OAuth Redirect URIs** field contains the correct URL for your server.

- For our local Python server, the default is:
  - \`http://localhost:8080/auth/facebook/callback\`
- For the guided flow in the dev tools, you also need:
  - \`http://localhost:8080/auth/facebook/callback-code-only\`

## 2. Common Scopes

The permissions (scopes) you need depend on what you want to do. Here are some common combinations to use in the OpenExpress **OAuth > Scopes** field:

### For Posting to a Facebook Page
\`\`\`
pages_show_list,pages_manage_posts,publish_video,pages_read_engagement
\`\`\`

### For Posting to a Facebook Group
*Note: The user must be an admin of the group, and your app must be installed in the group's settings.*
\`\`\`
groups_access_member_info,publish_to_groups
\`\`\`
`;
export const content = `
# Instagram-Specific Configuration

Instagram Graph API integration is managed through a **Meta App**, using the same App ID and Secret as your Facebook setup. After following the main **Shared Meta App Setup Guide**, you must complete these additional steps.

## 1. Key Requirements

- **Instagram Business or Creator Account**: The Instagram account you want to connect **must** be a Professional account (either Business or Creator). You cannot use a Personal account with the Graph API.
- **Linked Facebook Page**: The Instagram Professional account must be linked to a Facebook Page. This is a mandatory requirement by Meta. You can manage this link in the Instagram app's settings.

## 2. Use the Meta App Credentials

- Copy the **App ID** and **App Secret** from your Meta App and paste them into the **Instagram** configuration tab in OpenExpress. They are the same ones used for Facebook.

## 3. Add Instagram Scopes

To access Instagram data, you need to add specific Instagram permissions to the **OAuth > Scopes** field in your OpenExpress configuration for Instagram.

### Common Scopes for Posting
\`\`\`
instagram_basic,instagram_content_publish,pages_show_list
\`\`\`

- \`instagram_basic\`: Allows reading basic profile info.
- \`instagram_content_publish\`: Allows your app to publish content to the user's Instagram account.
- \`pages_show_list\`: This is required for your app to find and list the user's Facebook Pages and their linked Instagram accounts.
`;
export const content = `
# Instagram Graph API Setup Guide

Connecting to Instagram for professional use (posting, insights, etc.) is done through the **Instagram Graph API**, which is part of the Meta (Facebook) platform.

**There is no separate developer portal for Instagram.** Instead, you manage Instagram connections through the same Meta App you use for Facebook.

## Key Requirements

1.  **Meta Developer App**: You must have a Meta (Facebook) App already created. If you don't, please follow the **Facebook setup guide** first.
2.  **Instagram Business or Creator Account**: The Instagram account you want to connect must be a Business or Creator account. You cannot use a Personal account.
3.  **Linked Facebook Page**: The Instagram Business/Creator account must be linked to a Facebook Page. This is a mandatory requirement by Meta.

## How It Works

- **Use Facebook Login**: The authentication flow for Instagram uses **Facebook Login**. When a user authenticates, they will be asked to grant permissions for both their Facebook Pages and their linked Instagram Business Accounts.
- **Same App ID & Secret**: You will use the **same App ID and App Secret** from your Meta App for both Facebook and Instagram configurations in OpenExpress.

## Setup Steps

### Step 1: Ensure Prerequisites are Met

1.  **Convert to Professional Account**: In the Instagram app, go to Settings > Account > Switch to Professional Account.
2.  **Link to Facebook Page**: During the setup, or in Settings > Account > Sharing to Other Apps, link your Instagram account to a Facebook Page you manage.

### Step 2: Use the Facebook App Credentials

1.  Follow the guide for setting up a **Meta (Facebook) App** to get your App ID and App Secret.
2.  Copy and paste these same credentials into the **Instagram** configuration tab in OpenExpress.

### Step 3: Add Instagram Scopes

To access Instagram data, you need to add specific Instagram permissions to your **Facebook Login** scopes.

1.  In the OpenExpress Branding panel, go to the Instagram configuration.
2.  In the **OAuth > Scopes** field, add the required Instagram scopes. Common scopes include:
    - \`instagram_basic\`
    - \`instagram_content_publish\`
    - \`pages_show_list\` (This is required to see which pages/accounts the user has)

When a user connects, the Facebook login dialog will now show that your app is requesting permissions for Instagram.
`;

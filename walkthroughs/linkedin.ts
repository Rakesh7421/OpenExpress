export const content = `
# LinkedIn App Setup Guide

This guide will help you create a LinkedIn App to get the **Client ID** and **Client Secret** required for integration.

## Step 1: Go to LinkedIn Developers

1.  Log in to your LinkedIn account.
2.  Navigate to the [LinkedIn Developer Portal](https://www.linkedin.com/developers/).
3.  Click on **Create app**.

## Step 2: Create a New App

1.  Fill in the app creation form:
    -   **App name**: A unique name for your application (e.g., "OpenExpress Content Scheduler").
    -   **Company**: Link your app to a LinkedIn Company Page. You may need to create one if you don't have one.
    -   **Privacy policy URL**: You must provide a URL to your privacy policy.
    -   **App logo**: Upload a logo for your application.
2.  Agree to the terms and click **Create app**.

## Step 3: Configure Authentication

1.  After creation, you will land on your app's dashboard. Go to the **Auth** tab.
2.  Here you will find your **Client ID** and **Client Secret**.
    -   Click the eye icon to reveal the Client Secret.
    -   Copy these two values and paste them into the **Credentials** section for LinkedIn in the OpenExpress Branding panel.
        -   Client ID -> \`App ID\`
        -   Client Secret -> \`App Secret\`

### Configure Redirect URLs
This is a critical step for the OAuth 2.0 flow.

1.  On the **Auth** tab, scroll down to the **OAuth 2.0 settings** section.
2.  Click the pencil icon to edit the **Authorized redirect URLs for your app**.
3.  Click **+ Add redirect URL** and enter the exact URI for our local server:
    -   \`http://localhost:8080/auth/linkedin/callback\`
4.  Click **Update**.

## Step 4: Add Products

LinkedIn's API access is granular. You must request access to specific "Products" to use their features.

1.  Go to the **Products** tab in your app's dashboard.
2.  Find the products you need. For posting content, you will need:
    -   **Share on LinkedIn**
    -   **Sign In with LinkedIn**
3.  Click **Request access** for each one. You may need to provide justification. Approval can sometimes take time.
4.  Once a product is added, the necessary scopes will be available for your app. A common scope for posting is \`w_member_social\`. Enter this in the **OAuth > Scopes** field in OpenExpress.

You are now ready to connect your LinkedIn account!
`;

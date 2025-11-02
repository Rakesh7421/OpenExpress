export const content = `
# TikTok App Setup Guide

This guide will help you create a TikTok App to get the **Client Key** and **Client Secret** required for integration.

## Step 1: Go to TikTok for Developers

1.  Log in to your TikTok account.
2.  Navigate to the [TikTok for Developers](https://developers.tiktok.com/) portal.
3.  Click on **Manage apps** in the top right and then **Create new app**.

## Step 2: Create a New App

1.  Choose an app type. For most integrations, **Web App** is appropriate.
2.  Fill in the required information:
    -   **App name**: A unique name for your application (e.g., "OpenExpress Video Tool").
    -   **App description**: A brief description.
    -   **App icon**: Upload an icon.
    -   **Category**: Select the most relevant category.
3.  Click **Create**.

## Step 3: Get Your Credentials

1.  After your app is created, you will be taken to its dashboard.
2.  Your **Client Key** and **Client Secret** will be displayed in the **App details** section.
3.  Copy these two values and paste them into the **Credentials** section for TikTok in the OpenExpress Branding panel.
    -   Client Key -> \`App ID\`
    -   Client Secret -> \`App Secret\`

## Step 4: Configure the App

This is a critical step for the OAuth 2.0 flow.

1.  On your app's dashboard, you must configure platform settings.
2.  In the **Platform** section, add your **Redirect domains**. For local testing, you may need to add \`localhost\`.
3.  In the **Redirect URL** field under your platform settings, you must add the exact URI for our local server:
    -   \`http://localhost:8080/auth/tiktok/callback\`
4.  Click **Save changes**.

## Step 5: Request Permissions (Scopes)

You must request access to specific scopes to access user data.

1.  Go to the **Permissions** tab for your app.
2.  Find and request the scopes you need. A common starting scope is:
    -   \`user.info.basic\`
3.  You may need to provide a justification for why your app needs these permissions. TikTok's review process can take some time.
4.  Enter the approved scopes (e.g., \`user.info.basic\`) in the **OAuth > Scopes** field in OpenExpress.

Once your app and permissions are approved, you will be ready to connect your TikTok account!
`;

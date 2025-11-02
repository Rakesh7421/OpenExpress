export const content = `
# Pinterest App Setup Guide

This guide will help you create a Pinterest App to get the **App ID** and **App Secret** required for integration.

## Step 1: Go to Pinterest Developers

1.  Log in to your Pinterest account.
2.  Navigate to the [Pinterest Developers](https://developers.pinterest.com/) portal.
3.  Click on **My Apps** from the main menu or the "Get Started" button.

## Step 2: Create a New App

1.  Click the **Create App** button.
2.  Fill in the required information:
    - **Name**: A unique name for your application (e.g., "OpenExpress Pin Scheduler").
    - **Description**: A brief description of what your app does.
3.  Agree to the terms of service and click **Create**.

## Step 3: Configure Your App

You will be taken to your app's dashboard. Here you can find your credentials and configure settings.

### Find Your Credentials
- Your **App ID** is displayed prominently at the top of the dashboard.
- Your **App Secret** is also displayed. You may need to click a "Show" button to reveal it.
- Copy these two values and paste them into the **Credentials** section in the OpenExpress Branding panel.

### Configure Redirect URIs
This is a critical step for the OAuth flow.

1.  On your app's dashboard, scroll down to the **"App type"** section.
2.  In the **Redirect URIs** field, you must add the exact URI your server will use for the callback.
3.  For our local server setup, enter:
    - \`http://localhost:8080/auth/pinterest/callback\`
4.  Make sure to press Enter or click the "Add" button after typing the URI.
5.  Click **Save** at the bottom of the page.

## Step 4: Set Required Scopes

Your app will need permission to perform actions on behalf of users.

1.  In OpenExpress, find the **OAuth > Scopes** field for your Pinterest configuration.
2.  Enter the scopes your application needs, separated by commas. Common scopes for posting are:
    - \`pins:read\`
    - \`pins:write\`
    - \`boards:read\`
    - \`boards:write\`

When a user connects their account, they will be asked to approve these permissions.

You are now ready to connect your Pinterest account in OpenExpress!
`;

export const content = `
# Shared Meta (Facebook & Instagram) App Setup Guide

This guide walks you through creating a Meta App to get the **App ID** and **App Secret**. These credentials are used for **both Facebook and Instagram** integrations.

## Step 1: Go to Meta for Developers

1. Open the [Meta for Developers](https://developers.facebook.com/) website and log in with your Facebook account.
2. Click on **My Apps** in the top right corner.

## Step 2: Create a New App

1. Click the green **Create App** button.
2. Select **Other** as the use case and click **Next**.
3. Select **Business** as the app type. This type is required for most business-related permissions like posting to pages.
4. Provide an **App Name** (e.g., "OpenExpress Connector") and your contact email.
5. Click **Create App**. You may need to re-enter your Facebook password.

## Step 3: Configure Basic Settings

1. From your new app's dashboard, navigate to **App Settings > Basic** in the left sidebar.
2. Here you will find your **App ID** and **App Secret**.
    - Click **Show** next to the App Secret to reveal it.
3. **Important:** Copy these two values. You will paste them into the **Credentials** section in the OpenExpress Branding panel for **both** Facebook and Instagram.

## Step 4: Add the "Facebook Login" Product

1. In the left sidebar, click on **Add Product** (+).
2. Find **Facebook Login** and click **Set Up**.
3. Select **Web** as the platform.
4. In the **Site URL** field, enter the URL of your application. For local development, this is usually \`http://localhost:5173\`. Click **Save**.

## Step 5: Configure Valid OAuth Redirect URIs

This is the most critical step for the OAuth flow to work.

1. In the left sidebar, under **Facebook Login**, click on **Settings**.
2. Find the **Valid OAuth Redirect URIs** field.
3. Enter the exact redirect URI your server will use. See the platform-specific guides below for the exact URLs to add.
4. Click **Save Changes** at the bottom of the page.

## Step 6: Go Live (for Production)

Your app starts in **Development Mode**. In this mode, only you (the app admin) can use the login flow.

- To allow other users, you must go through the App Review process and switch your app to **Live Mode** using the toggle at the top of the dashboard. This requires providing a privacy policy URL and other details in the Basic Settings.
`;
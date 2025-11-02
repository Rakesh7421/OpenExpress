export const content = `
# X (Twitter) App Setup Guide

This guide will help you create an X App to get the **Consumer Key** and **Consumer Secret** required for integration.

## Step 1: Apply for a Developer Account

1.  Navigate to the [X Developer Platform](https://developer.twitter.com/).
2.  You will need to apply for a developer account if you don't have one. This may require you to describe your intended use of the API.
3.  Once approved, you can access the Developer Portal Dashboard.

## Step 2: Create a New Project and App

1.  In the Developer Portal, go to the **Projects & Apps** section.
2.  Create a new **Project**. Give it a name, select a use case, and provide a description.
3.  Within your new project, create a new **App**. You'll be asked to provide a unique App name.

## Step 3: Get Your Credentials

1.  Once your app is created, your **API Key** (Consumer Key) and **API Key Secret** (Consumer Secret) will be displayed.
2.  **Important:** Copy these keys immediately and store them securely. The secret is only shown once.
3.  Paste these values into the **Credentials** section for the X platform in the OpenExpress Branding panel.
    -   API Key -> \`Consumer Key\`
    -   API Key Secret -> \`Consumer Secret\`

## Step 4: Configure App Settings

This is a critical step for the OAuth 1.0a flow to work.

1.  Go to your App's settings in the Developer Portal.
2.  Find the **Authentication settings** section and click **Edit**.
3.  Enable **3-legged OAuth**.
4.  In the **Callback URI / Redirect URL** field, add the exact URI for our local server:
    -   \`http://localhost:8080/auth/twitter/callback\`
5.  In the **Website URL** field, you can add the URL of your project (e.g., your main website).
6.  Click **Save**.

## Step 5: Set Permissions

1.  In your App's settings, go to the **Keys and Tokens** tab.
2.  Ensure your App has the necessary permissions (e.g., "Read and Write") to perform the actions you need, like posting tweets.
3.  In OpenExpress, set the **OAuth > Scopes** field. For posting tweets, the standard OAuth 1.0a flow doesn't use scopes in the same way as OAuth 2.0, but your app's permission level serves a similar purpose. For OAuth 2.0 (if you configure it), you'd use scopes like \`tweet.read\`, \`tweet.write\`, and \`users.read\`.

You are now ready to connect your X account in OpenExpress!
`;

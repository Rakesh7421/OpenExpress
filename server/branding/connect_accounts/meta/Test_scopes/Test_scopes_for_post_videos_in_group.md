# Test Plan: Posting Videos to a Facebook Group

- **Scope(s) Required:** `groups_access_member_info`, `publish_to_groups`
- **Endpoint:** `/{group-id}/videos`
- **Method:** `POST`
- **Prerequisites:** 
  - User must be an admin of the group.
  - The app must be installed in the group's settings.
- **Test Steps:**
  1. Authenticate user and acquire a User Access Token with the required scopes.
  2. Present UI for user to select a video file and enter a description.
  3. Make a POST request to the Graph API endpoint.
  4. Verify the video appears in the target Facebook Group.

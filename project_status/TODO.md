# Project To-Do List

This document tracks the pending tasks and future development roadmap for the OpenExpress application.

## 🎯 Immediate Priorities

- [x] **Implement Core Canvas Functionality:**
  - [x] Allow elements (Text, Images, Shapes) to be added to the main `Canvas`.
  - [x] Make `Canvas` elements interactive: select, move, resize, and edit properties.
  - [x] Connect the `RightPanel` to reflect and modify the properties of the selected canvas element.
  - [x] Implement a dynamic `LayersPanel` that reflects the canvas elements and allows selection.
- [ ] **Complete API Business Logic:**
  - [ ] Fill in the placeholder logic in `server/server_py.txt` (or `/api/api/*.js`) to make actual API calls to social platforms using the stored user tokens.
  - [ ] Implement token refresh logic for providers that support it.
- [x] **Connect UI to Backend APIs:**
  - [x] Implement UI for the API Action Center to use multipart/form-data for file uploads.
  - [x] Connect `Share` and `Export` buttons in the `Header` to functional logic. (`Export` downloads design as JSON, `Share` opens a modal).

## ✨ Future Features & Enhancements

- [ ] **Develop Advanced Feature Panels:**
  - [ ] **Collaboration**: Implement real-time features like shared cursors, comments, and live editing.
  - [ ] **Version Control**: Build the UI to show a history of design changes, allowing users to revert to previous versions.
- [ ] **Database Migration:**
  - [ ] Plan and execute the migration from the file-based `db.json` to a more robust database (e.g., PostgreSQL, MongoDB) for production.
  - [ ] Update `server/database.js` or Python equivalent to use a proper database client.
- [ ] **Production Readiness:**
  - [ ] Implement comprehensive error handling and logging across all services.
  - [ ] Configure HTTPS/SSL for production environments.

## user suggestions
- [x] **Enhance Scope Testing**: The "Test Scopes" feature now provides a detailed access audit. It checks:
    - [x] Which specific scopes are granted to the token.
    - [x] A list of Facebook Pages the user can manage, indicating if video posting is permitted for each.
    - [x] A list of Facebook Groups the user is in, indicating if the token has the necessary scope to publish content.
- [x] **Live Mode Callback URL Validation**: The UI now displays a warning if the Redirect URI is set to `localhost` when the configuration stage is set to "Live", as most platforms require a public domain for live apps.

# Skip for a while until user approves
## 📦 DevOps & Deployment

- [ ] **Containerization:**
  - [ ] Create a `Dockerfile` for the Node.js authentication server.
  - [ ] Create a `Dockerfile` for the Python API server.
  - [ ] Create a `docker-compose.yml` to orchestrate all services for easier local setup and consistent environments.
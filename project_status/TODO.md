# Project To-Do List

This document tracks the pending tasks and future development roadmap for the OpenExpress application.

## 🎯 Immediate Priorities

- [ ] **Implement Core Canvas Functionality:**
  - [ ] Allow elements (Text, Images, Shapes) to be added to the main `Canvas`.
  - [ ] Make `Canvas` elements interactive: select, move, resize, and edit properties.
  - [ ] Connect the `RightPanel` to reflect and modify the properties of the selected canvas element.
- [ ] **Complete API Business Logic:**
  - [ ] Fill in the placeholder logic in `/api/api/*.js` to make actual API calls to social platforms using the stored user tokens.
  - [ ] Implement token refresh logic for providers that support it.
- [ ] **Connect UI to Backend APIs:**
  - [ ] Implement UI for the API Action Center to use multipart/form-data for file uploads.
  - [ ] Connect `Share` and `Export` buttons in the `Header` to functional backend logic.

## ✨ Future Features & Enhancements

- [ ] **Develop Advanced Feature Panels:**
  - [ ] **Collaboration**: Implement real-time features like shared cursors, comments, and live editing.
  - [ ] **Version Control**: Build the UI to show a history of design changes, allowing users to revert to previous versions.
- [ ] **Database Migration:**
  - [ ] Plan and execute the migration from the file-based `db.json` to a more robust database (e.g., PostgreSQL, MongoDB) for production.
  - [ ] Update `server/database.js` to use a proper database client.
- [ ] **Production Readiness:**
  - [ ] Implement comprehensive error handling and logging across all services.
  - [ ] Configure HTTPS/SSL for production environments.

## 📦 DevOps & Deployment

- [ ] **Containerization:**
  - [ ] Create a `Dockerfile` for the Node.js authentication server.
  - [ ] Create a `Dockerfile` for the Python API server.
  - [ ] Create a `docker-compose.yml` to orchestrate all services for easier local setup and consistent environments.

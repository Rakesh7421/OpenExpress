# OpenExpress

OpenExpress is a powerful design and content creation application inspired by Adobe Express. It provides a versatile user interface with two distinct modes: a feature-rich **Developer version** for advanced users and a streamlined **Client version** for focused content editing and sharing.

## ✨ Features

- **Dual-Mode UI**: Switch between a 'Developer' view with full tooling and a 'Client' view for simplified access.
- **Content Creation**: Tools for adding text, images, and shapes to a design canvas.
- **AI-Powered Suggestions**: Integrated with the Gemini API to provide creative design ideas.
- **Social Media Integration**: Connect and authenticate with platforms like Meta, X (Twitter), LinkedIn, and TikTok via a unified Python backend.
- **Content Planner**: Schedule posts for various brands and social platforms.
- **Developer Tools**: Includes an API action tester, server connection manager, and a pre-launch checklist.
- **Push to Client**: Developers can selectively "push" advanced features to the Client view.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend (API & Authentication)**: Python, Flask, Authlib
- **AI**: Google Gemini API
- **Deployment**: Configured for Vercel

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later) for the frontend development server.
- [Python](https://www.python.org/) (v3.8 or later) with `pip`.
- A virtual environment for Python is recommended (`venv`).

### 2. Initial Setup

The project includes an interactive task runner to simplify setup.

**First-time setup:**
1.  Open your terminal in the project root.
2.  Run the task runner:
    ```bash
    python tasts_py.txt
    ```
3.  From the menu, select option **3. Install All Dependencies**. This will:
    - Install Python packages from `server/requirements.txt` and `requirements.txt`.
    - Create a `package.json` file if it doesn't exist.
    - Install Node.js packages using `npm install`.

### 3. Environment Variables

The application requires API keys and secrets to function correctly.

1.  Navigate to the project root and create a `secrets` directory if it doesn't exist.
2.  Inside `secrets`, create a file named `.env`.
3.  Copy the contents from `.env.example.txt` into your new `.env` file.
4.  Fill in the required values, especially `GEMINI_API_KEY`, `JWT_SECRET`, and `SESSION_SECRET`.

> **Note for Special User 'Tempo' on Windows:**
> For the user `Tempo`, the application is configured to use specific paths for environment variables and Node.js modules to keep the project directory clean and share dependencies.
>
> - **Environment File**: The application will first look for the `.env` file at the external path `F:\Codebase\EnvSetup\cred\.env\OpenExpress\.env`. Place your `.env` file there instead of in the project's `secrets` directory.
> - **Node.js Modules**: Instead of a local `node_modules` folder, this setup uses a centralized directory. To create the required symbolic link, run the following command in a bash shell (like Git Bash):
>
> ```bash
> mkdir -p /f/installer_files/node_modules/openexpress/node_modules /f/Codebase/OpenExpress && rm -rf /f/Codebase/OpenExpress/node_modules && ln -s /f/installer_files/node_modules/openexpress/node_modules /f/Codebase/OpenExpress/node_modules && echo "✅ Symlink created successfully."
> ```
>
> The automated task runner (`python tasts_py.txt`) also handles this setup, but the command above can be used for manual configuration.

### 4. Running the Application

All services can be run concurrently using the task runner.

1.  Run the task runner:
    ```bash
    python tasts_py.txt
    ```
2.  Select option **6. Run All Services**. This will start:
    - The **Python API & Auth Server** (defaults to `http://localhost:8080`)
    - The **Frontend Dev Server** (defaults to `http://localhost:5173`)

3.  Open your browser and navigate to the URL provided by the Frontend Dev Server.

## 📂 Project Structure
```
/
├── api/                  # Vercel serverless function configuration
│   └── index_py.txt      # Python serverless entry point for all API and Auth logic
├── components/           # React components
├── secrets/              # (Git-ignored) Contains the .env file for secrets
├── server/               # Local backend server source files
│   └── server_py.txt     # Python Flask server for all local dev logic
├── services/             # Frontend services (e.g., API calls)
├── tasts_py.txt          # Python-based developer task runner
└── vercel.json           # Vercel deployment configuration
```
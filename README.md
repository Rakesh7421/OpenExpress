# OpenExpress

OpenExpress is a powerful design and content creation application inspired by Adobe Express. It provides a versatile user interface with two distinct modes: a feature-rich **Developer version** for advanced users and a streamlined **Client version** for focused content editing and sharing.

## ✨ Features

- **Dual-Mode UI**: Switch between a 'Developer' view with full tooling and a 'Client' view for simplified access.
- **Content Creation**: Tools for adding text, images, and shapes to a design canvas.
- **AI-Powered Suggestions**: Integrated with the Gemini API to provide creative design ideas.
- **Social Media Integration**: Connect and authenticate with platforms like Meta, X (Twitter), LinkedIn, and TikTok.
- **Content Planner**: Schedule posts for various brands and social platforms.
- **Developer Tools**: Includes an API action tester, server connection manager, and a pre-launch checklist.
- **Push to Client**: Developers can selectively "push" advanced features to the Client view.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend (API)**: Python, Flask
- **Backend (Authentication)**: Node.js, Express, Passport.js
- **AI**: Google Gemini API
- **Deployment**: Configured for Vercel

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/) (v3.8 or later) with `pip`
- A virtual environment for Python is recommended (`venv`).

### 2. Initial Setup

The project includes an interactive task runner to simplify setup.

**First-time setup:**
1.  Open your terminal in the project root.
2.  Run the task runner:
    ```bash
    python tasts_py.txt
    ```
3.  From the menu, select option **1. Install Dependencies**. This will:
    - Install Python packages from `server/requirements.txt` and `requirements.txt`.
    - Create a `package.json` file if it doesn't exist.
    - Install Node.js packages using `npm install`.

### 3. Environment Variables

The application requires API keys and secrets to function correctly.

1.  Navigate to the project root and create a `secrets` directory if it doesn't exist.
2.  Inside `secrets`, create a file named `.env`.
3.  Copy the contents from `.env.example.txt` into your new `.env` file.
4.  Fill in the required values, especially `GEMINI_API_KEY` and the OAuth credentials for the platforms you wish to test.

### 4. Running the Application

All services can be run concurrently using the task runner.

1.  Run the task runner:
    ```bash
    python tasts_py.txt
    ```
2.  Select option **5. Run All Services (Concurrent)**. This will start:
    - The **Python API Server** (defaults to `http://localhost:8080`)
    - The **Node.js Auth Server** (defaults to `http://localhost:3001`)
    - The **Frontend Dev Server** (defaults to `http://localhost:3000`)

3.  Open your browser and navigate to `http://localhost:3000`.

## 📂 Project Structure
```
/
├── api/                  # Vercel serverless function configuration
│   ├── index_py.txt      # Python serverless entry point (source)
│   └── auth.js           # Node.js serverless entry point
├── components/           # React components
├── secrets/              # (Git-ignored) Contains the .env file for secrets
├── server/               # Local backend server source files
│   ├── server_py.txt     # Python Flask server for local dev
│   └── auth.js           # Node.js Express server for local dev
├── services/             # Frontend services (e.g., API calls)
├── tasts_py.txt          # Python-based developer task runner
└── vercel.json           # Vercel deployment configuration
```

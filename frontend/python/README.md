
# OpenExpress Python Frontend (CLI)

This directory contains a Python-based command-line interface (CLI) that acts as a frontend for the OpenExpress application. It allows you to interact with the backend services directly from your terminal, providing a scriptable alternative to the web UI.

## Features

- **Interactive Menu**: Easy-to-use menu for navigating features.
- **AI Design Suggester**: Get AI-powered design ideas.
- **Content Planner**: Generate post ideas and schedule content for different brands and platforms.
- **Authentication**: Uses the same JWT authentication as the web UI to access secure endpoints.

## Prerequisites

- Python 3.8+
- The `requests` library (`pip install requests`)
- The backend server (`server/server_py.txt`) must be running.

## Setup

1.  **Install Dependencies**: Make sure you have installed the project's Python dependencies, which includes `requests`. You can do this using the main `tasts_py.txt` runner.
    ```bash
    python tasts_py.txt
    # Select option 2: Install Backend (Python) Only
    ```
2.  **Get Authentication Token**:
    - Run the web application and connect at least one social media account in the **Branding** panel. This generates a JWT.
    - For this CLI to work, you need that token. The first time you run the CLI, it will prompt you to paste the token.
    - **How to get the token**:
        1. Open the web app in your browser.
        2. Open the browser's Developer Tools (F12).
        3. Go to the `Application` tab (in Chrome) or `Storage` tab (in Firefox).
        4. Look for `Local Storage` and find the token stored under a key like `meta_jwt`, `x_jwt`, etc.
        5. Copy the entire token string.

## How to Run

1.  **Start the Backend Server**: Use the main `tasts_py.txt` runner to start the Python server.
    ```bash
    python tasts_py.txt
    # Select option 6: Run Python Server Only
    ```
2.  **Run the Python Frontend**: In a separate terminal, navigate to the project root and run the `main_py.txt` script.
    ```bash
    python frontend/python/main_py.txt
    ```
3.  Follow the on-screen prompts to use the application.


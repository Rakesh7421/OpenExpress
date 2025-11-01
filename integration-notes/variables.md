# OpenExpress Integration Variables

## Standard Variable Names Across All Platforms

### Environment Variables
- `API_KEY` - Gemini AI API key (used in all platforms)
- `JWT_SECRET` - JWT authentication secret (backend only)
- `PORT` - Server port (default: 8080 for backend, 5173 for frontend)

### API Endpoints
- `BASE_URL` - Backend server URL (default: http://localhost:8080)
- `/api/ai-suggestions` - AI design suggestions endpoint
- `/api/save-design` - Save design endpoint (requires auth)

### File Paths
- `.env` - Environment variables file
- `server/server.py` - Python Flask backend
- `services/geminiService.ts` - Frontend AI service
- `components/ContentPanel.tsx` - Main UI component

### Branch-Specific Notes
- **main branch**: Latest from Gemini AI Studio
- **kilo-code-improved-backend branch**: Enhanced backend with AI integration

## Platform-Specific Values

### Gemini AI Studio
- API_KEY: [Set in AI Studio environment]
- BASE_URL: [AI Studio internal URL]

### GitHub Repository (main branch)
- API_KEY: [Set in .env file]
- BASE_URL: http://localhost:8080 (for local development)

### Local Development (kilo-code-improved-backend)
- API_KEY: [Copy from .env]
- BASE_URL: http://localhost:8080
- JWT_SECRET: [Generate secure random string]

## Integration Rules

1. **Same variable names** across all platforms
2. **Different values** based on environment/platform
3. **Consistent API contracts** between frontend and backend
4. **Environment-specific configuration** files

## Switching Between Branches

When switching branches:
1. Keep `.env` file with your local API_KEY
2. Backend configurations may differ between branches
3. Test API endpoints after switching
4. Update environment variables if needed
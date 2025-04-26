# Appraisers Dashboard

A professional web application for managing and completing art and antique appraisals. Built with React, Vite, and Tailwind CSS, integrated with a secure backend API.

## Overview

The Appraisers Dashboard provides a streamlined interface for professional appraisers to:
- View pending and completed appraisals
- Complete new appraisals with detailed information
- Edit existing appraisal details
- Manage appraisal metadata and images
- Generate comprehensive appraisal reports

## Key Features

- **Secure Authentication**
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Secure cookie handling

- **Dashboard Management**
  - Filter between pending and completed appraisals
  - Real-time search functionality
  - Sortable data tables
  - Pagination controls for large datasets

- **Appraisal Processing**
  - Interactive image viewer with zoom/pan/rotate
  - Detailed form validation
  - Automatic status updates
  - Step-by-step processing visualization

- **Data Management**
  - ACF fields editing
  - Image URL management
  - Metadata handling
  - Bulk appraisal operations

## Quick Start

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CompletedAppraisal/  # Components for completed appraisals
│   │   ├── details/        # Detail components
│   │   └── ui/             # Base UI components (shadcn)
│   ├── config/             # Application configuration
│   │   ├── constants.js    # API routes and constants
│   │   └── endpoints.js    # API endpoint URLs
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard page
│   │   ├── AppraisalPage.jsx  # Pending appraisal page
│   │   ├── CompletedAppraisalPage.jsx  # Completed appraisal page
│   │   ├── EditAppraisalPage.jsx  # Edit appraisal page
│   │   └── BulkAppraisalPage.jsx  # Bulk appraisal page
│   ├── services/           # API and external services
│   │   ├── api.js          # Base API service
│   │   ├── auth.js         # Authentication service
│   │   ├── appraisals.js   # Appraisal service
│   │   └── websocket.js    # WebSocket service
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Main application component
│   ├── App.css             # Global styles
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global CSS styles
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite bundler configuration
├── Dockerfile              # Docker configuration
├── cloudbuild.yaml         # Google Cloud Build configuration
└── netlify.toml            # Netlify configuration
```

## Core Components

### Class/Component Structure

#### Main Components
- `App.jsx`: Main application component, sets up routing
- `Dashboard.jsx`: Main dashboard for viewing pending and completed appraisals
- `AppraisalPage.jsx`: Displays and processes pending appraisals
- `CompletedAppraisalPage.jsx`: Shows details of completed appraisals
- `EditAppraisalPage.jsx`: Provides interface for editing appraisals
- `BulkAppraisalPage.jsx`: Handles bulk appraisal processing

#### UI Components
- `AppraisalForm.jsx`: Form for submitting and updating appraisals
- `AppraisalsTable.jsx`: Displays appraisal listings with sorting/filtering
- `AppraisalDetails.jsx`: Shows detailed information about an appraisal
- `AppraisalProcessingPanel.jsx`: Controls for processing appraisals
- `StepProcessingPanel.jsx`: Shows step-by-step processing interface
- `ImageViewer.jsx`: Interactive component for viewing and manipulating images
- `AcfFieldsList.jsx`: Displays and edits ACF fields from WordPress
- `WorkflowDiagram.jsx`: Visual representation of appraisal workflow
- `MermaidDiagram.jsx`: Renders mermaid diagrams
- `LoginForm.jsx`: Authentication form
- `GoogleSignIn.jsx`: Google OAuth 2.0 integration
- `Header.jsx`: Application header with navigation and user info
- `PaginationControls.jsx`: Controls for paginating large datasets
- `StatusUpdateToast.jsx`: Notification component for status updates

### Services

#### api.js
Core API service that handles HTTP requests with error handling and authentication.

Main functions:
- `get(endpoint)`: Makes GET requests 
- `post(endpoint, data)`: Makes POST requests
- `put(endpoint, data)`: Makes PUT requests
- `delete(endpoint)`: Makes DELETE requests
- `setAuthToken(token)`: Sets authorization header
- `clearAuthToken()`: Clears authorization header

#### auth.js
Manages authentication processes.

Main functions:
- `loginWithGoogle(credential)`: Authenticates using Google OAuth 
- `login(email, password)`: Email/password authentication
- `logout()`: Logs out user and clears tokens
- `refreshToken()`: Refreshes authentication token
- `isAuthenticated()`: Checks if user is authenticated

#### appraisals.js
Handles all appraisal-related API interactions.

Main functions:
- `getPending()`: Fetches pending appraisals
- `getCompleted()`: Fetches completed appraisals
- `getDetails(id)`: Gets appraisal details
- `getCompletedAppraisalDetails(id)`: Gets completed appraisal details
- `getDetailsForEdit(id)`: Gets appraisal details for editing
- `updateAppraisal(id, data)`: Updates an appraisal
- `setValue(id, value, description, isEdit)`: Sets appraisal value
- `completeProcess(id, value, description, type)`: Completes an appraisal
- `getPdfSteps()`: Gets PDF generation steps
- `generatePdfSteps(postId, sessionId, startStep, options)`: Generates PDF
- `getProcessSteps()`: Gets processing steps
- `processFromStep(id, startStep, options)`: Processes from specific step
- `reprocessStep(id, stepName)`: Reprocesses a specific step
- `getBySessionId(sessionId)`: Gets appraisal by session ID
- `reprocessCompletedAppraisal(id)`: Reprocesses a completed appraisal

## Configuration

### Environment Variables

```env
# Required - Backend API URL
VITE_BACKEND_URL=https://appraisers-backend-856401495068.us-central1.run.app

# Optional - Google client ID for authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Environment name
VITE_APP_ENV=development
```

### API Configuration

The application uses a centralized configuration for API endpoints:

#### constants.js
Defines API route paths:
```javascript
export const API_ROUTES = {
  AUTH: {
    GOOGLE: '/api/auth/google',
    LOGIN: '/api/auth/login', 
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  APPRAISALS: {
    LIST: '/api/appraisals',
    COMPLETED: '/api/appraisals/completed',
    DETAILS: '/api/appraisals/:id/list',
    DETAILS_EDIT: '/api/appraisals/:id/list-edit',
    COMPLETED_DETAILS: '/api/appraisals/:id/details',
    REPROCESS_STEP: '/api/appraisals/:id/reprocess-step',
    COMPLETE_PROCESS: '/api/appraisals/:id/complete-process',
    SET_VALUE: '/api/appraisals/:id/set-value',
    PDF_STEPS: '/api/pdf/steps',
    GENERATE_PDF_STEPS: '/api/pdf/generate-pdf-steps',
    PROCESS_STEPS: '/api/appraisals/steps',
    PROCESS_FROM_STEP: '/api/appraisals/:id/process-from-step'
  }
};
```

#### endpoints.js
Constructs full API endpoint URLs:
```javascript
import { API_ROUTES } from './constants';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ENDPOINTS = {
  AUTH: {
    GOOGLE: `${API_BASE_URL}${API_ROUTES.AUTH.GOOGLE}`,
    LOGIN: `${API_BASE_URL}${API_ROUTES.AUTH.LOGIN}`,
    LOGOUT: `${API_BASE_URL}${API_ROUTES.AUTH.LOGOUT}`,
    REFRESH: `${API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`
  },
  APPRAISALS: {
    LIST: `${API_BASE_URL}${API_ROUTES.APPRAISALS.LIST}`,
    COMPLETED: `${API_BASE_URL}${API_ROUTES.APPRAISALS.COMPLETED}`,
    DETAILS: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.DETAILS.replace(':id', id)}`,
    DETAILS_EDIT: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.DETAILS_EDIT.replace(':id', id)}`,
    COMPLETED_DETAILS: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.COMPLETED_DETAILS.replace(':id', id)}`,
    REPROCESS_STEP: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.REPROCESS_STEP.replace(':id', id)}`,
    COMPLETE_PROCESS: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.COMPLETE_PROCESS.replace(':id', id)}`,
    SET_VALUE: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.SET_VALUE.replace(':id', id)}`,
    BY_SESSION_ID: (sessionId) => `${API_BASE_URL}/api/appraisals/session/${sessionId}`,
    BULK_IMAGES: (id) => `${API_BASE_URL}/api/appraisals/${id}/bulk-images`,
    PROCESS_BULK: (id) => `${API_BASE_URL}/api/appraisals/${id}/process-bulk`,
    PDF_STEPS: `${API_BASE_URL}${API_ROUTES.APPRAISALS.PDF_STEPS}`,
    GENERATE_PDF_STEPS: `${API_BASE_URL}${API_ROUTES.APPRAISALS.GENERATE_PDF_STEPS}`,
    PROCESS_STEPS: `${API_BASE_URL}${API_ROUTES.APPRAISALS.PROCESS_STEPS}`,
    PROCESS_FROM_STEP: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.PROCESS_FROM_STEP.replace(':id', id)}`
  }
};
```

## API Endpoints

### Authentication

#### Google Sign-In
```http
POST /api/auth/google
Content-Type: application/json

{
  "credential": "google_id_token"
}
```
Response:
```json
{
  "success": true,
  "name": "User Name"
}
```

#### Logout
```http
POST /api/auth/logout
```
Response:
```json
{
  "success": true
}
```

### Appraisals

#### List Pending Appraisals
```http
GET /api/appraisals
```
Response:
```json
[
  {
    "id": "string",
    "date": "ISO-8601",
    "appraisalType": "string",
    "identifier": "string",
    "status": "pending",
    "iaDescription": "string",
    "wordpressUrl": "string"
  }
]
```

#### List Completed Appraisals
```http
GET /api/appraisals/completed
```
Response: Same structure as pending appraisals

#### Get Appraisal Details
```http
GET /api/appraisals/:id/list
```
Response:
```json
{
  "customerDescription": "string",
  "iaDescription": "string",
  "images": {
    "main": "url",
    "age": "url",
    "signature": "url"
  }
}
```

#### Get Appraisal Details for Editing
```http
GET /api/appraisals/:id/details-edit
```

#### Complete Appraisal
```http
POST /api/appraisals/:id/complete-process
Content-Type: application/json

{
  "appraisalValue": number,
  "description": "string",
  "appraisalType": "string"
}
```
Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Update Appraisal Value
```http
POST /api/appraisals/:id/set-value
Content-Type: application/json

{
  "appraisalValue": number,
  "description": "string",
  "isEdit": boolean
}
```
Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Reprocess Step
```http
POST /api/appraisals/:id/reprocess-step
Content-Type: application/json

{
  "stepName": "string"
}
```
Response:
```json
{
  "success": true,
  "message": "string"
}
```

#### Process From Step
```http
POST /api/appraisals/:id/process-from-step
Content-Type: application/json

{
  "startStep": "string",
  "options": {
    "reprocessStatistics": boolean,
    "regeneratePdf": boolean
  }
}
```
Response:
```json
{
  "success": true,
  "message": "string"
}
```

## Deployment

### Docker Configuration

The application is containerized with Docker for easy deployment:

```dockerfile
# Stage 1: Build the React app
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine
RUN apk add --no-cache gettext
COPY --from=build /app/build /usr/share/nginx/html
COPY default.conf.template /etc/nginx/conf.d/default.conf.template
EXPOSE 8080
ENV PORT=8080
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

### Cloud Build (CI/CD)

The application is configured for continuous deployment via Google Cloud Build:

```yaml
steps:
  # Step 1: Build the Docker image
  - name: 'gcr.io/cloud-builders/docker'
    id: 'Build Frontend'
    args:
      - build
      - '-t'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/appraisers-frontend:$SHORT_SHA'
      - '--build-arg'
      - 'REACT_APP_BACKEND_URL=https://appraisers-backend-856401495068.us-central1.run.app'
      - '.'

  # Step 2: Push the Docker image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    id: 'Push Frontend'
    args:
      - push
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/appraisers-frontend:$SHORT_SHA'

  # Step 3: Deploy the image to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    id: 'Deploy Frontend'
    args:
      - 'run'
      - 'deploy'
      - 'appraisers-frontend'
      - '--image'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/docker-repo/appraisers-frontend:$SHORT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
```

### Netlify Configuration

The application is also configured for deployment on Netlify:

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Secrets Management

The application uses environment variables for configuration with the following approach:

1. **Development**: Environment variables are set in `.env` file (not checked into Git)
2. **Production/GitHub**: Environment variables are managed through Cloud Run service configuration
3. **Netlify**: Environment variables are configured in the Netlify UI

Important note: No secrets are hardcoded in the source code.

## Dependencies

### Core Dependencies
- React 18
- React Router 6
- Axios for API communication
- Tailwind CSS for styling
- Radix UI components
- TanStack React Table

### Development Dependencies
- Vite
- PostCSS
- Tailwind plugins
- ESLint (configured via package.json)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

- CORS enabled
- Secure cookie handling
- JWT token management
- Google OAuth 2.0 integration
- Input validation and sanitization

## License

MIT License - see LICENSE file for details
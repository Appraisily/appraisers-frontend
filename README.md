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
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/          # Base UI components (shadcn)
│   ├── config/          # Application configuration
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── services/        # API and external services
│   └── utils/           # Helper functions
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite bundler configuration
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
  "description": "string"
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
  "description": "string"
}
```
Response:
```json
{
  "success": true,
  "message": "string"
}
```

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required - URL of the backend API
VITE_BACKEND_URL=https://appraisers-backend-856401495068.us-central1.run.app
# Optional - Google client ID for authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# Environment name
VITE_APP_ENV=development
```

#### Netlify Deployment

When deploying to Netlify, set these environment variables in the Netlify UI under:
1. Site settings > Build & deploy > Environment
2. Add the variables with the same names as above

Important: Do not commit the `.env` file to the repository. It's already in `.gitignore` to prevent this.

## UI Components

The application uses a combination of custom components and shadcn/ui components for a consistent design system:

- **Custom Components**
  - `AppraisalForm`: Form for completing appraisals
  - `AppraisalsTable`: Table display for appraisal listings
  - `ImageViewer`: Interactive image viewing component
  - `StepProcessingPanel`: Visual display of processing steps

- **UI Components** (shadcn/ui)
  - Button, Card, Input, Select, Checkbox
  - Table, Tabs, Pagination
  - Alert, Badge, Tooltip

## Development

- Built with Vite + React
- Styled with Tailwind CSS
- Uses React Router for navigation
- Implements React Zoom Pan Pinch for image manipulation
- Axios for API communication

### Code Style Guidelines

Follow the coding standards defined in [CLAUDE.md](../CLAUDE.md):

- ES6+ JavaScript features
- React functional components with hooks
- Named exports preferred
- 2-space indentation, semicolons required
- JSDoc comments for complex components and functions

## Production Deployment

The application is configured for deployment on Netlify with the following features:
- Automatic HTTPS
- Asset optimization
- Route handling
- Environment variable management

Docker configuration is also available for containerized deployment.

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
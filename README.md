# Appraisers Dashboard

A professional web application for managing and completing art and antique appraisals. Built with React, Vite, and Tailwind CSS, integrated with a secure backend API.

## Overview

The Appraisers Dashboard provides a streamlined interface for professional appraisers to:
- View pending and completed appraisals
- Complete new appraisals with detailed information
- Edit existing appraisal details
- Manage appraisal metadata and images
- Receive real-time updates on appraisal status changes

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
  - Real-time notifications via WebSockets

- **Data Management**
  - ACF fields editing
  - Image URL management
  - Metadata handling
  - Bulk appraisal operations

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

## Setup and Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with required environment variables:
```env
VITE_BACKEND_URL=https://appraisers-backend-856401495068.us-central1.run.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_WS_URL=wss://your-websocket-endpoint
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Development

- Built with Vite + React
- Styled with Tailwind CSS and component-specific CSS
- Uses React Router for navigation
- Implements React Zoom Pan Pinch for image manipulation
- Axios for API communication
- WebSocket for real-time updates

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
# Appraisers Dashboard

A professional web application for managing and completing art and antique appraisals. Built with React and integrated with a secure backend API.

## Overview

The Appraisers Dashboard provides a streamlined interface for professional appraisers to:
- View pending and completed appraisals
- Complete new appraisals with detailed information
- Edit existing appraisal details
- Manage appraisal metadata and images

## Key Features

- **Secure Authentication**
  - Google OAuth 2.0 integration
  - JWT-based session management
  - Secure cookie handling

- **Dashboard Management**
  - Filter between pending and completed appraisals
  - Real-time search functionality
  - Sortable data tables

- **Appraisal Processing**
  - Interactive image viewer with zoom/pan/rotate
  - Detailed form validation
  - Automatic status updates

- **Data Management**
  - ACF fields editing
  - Image URL management
  - Metadata handling

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
- Uses React Router for navigation
- Implements React Zoom Pan Pinch for image manipulation
- Styled with modular CSS
- Axios for API communication

## Production Deployment

The application is configured for deployment on Netlify with the following features:
- Automatic HTTPS
- Asset optimization
- Route handling
- Environment variable management

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
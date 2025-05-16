# New Appraisal API Implementation Guide

This document describes the backend API implementation needed to support the new "Create Appraisal" feature in the Appraisers Frontend.

## API Endpoint

The frontend expects the following API endpoint to be available:

```
POST /api/appraisals/new
```

## Request Format

The request will be sent as `multipart/form-data` with the following fields:

- `mainImage` (File, required): The main image of the item to be appraised
- `signatureImage` (File, optional): Image showing signature details (if applicable)
- `ageImage` (File, optional): Image showing age/dating details (if applicable)
- `description` (String, required): Detailed description of the item
- `customerName` (String, required): Name of the customer requesting the appraisal
- `customerEmail` (String, required): Email address of the customer
- `sessionId` (String, required): Unique session identifier for the appraisal
- `appraisalType` (String, required): Type of appraisal (Regular, Quick, Certificate)

## Expected Workflow

The backend API should:

1. Validate all required fields are present
2. Create a new row in the Pending Appraisals Google Sheet with:
   - Date (current date)
   - Appraisal Type
   - Identifier (session ID)
   - Customer Email
   - Customer Name
   - Description

3. After successfully creating the row in the Google Sheet, send the images and relevant data to the Payment Processor backend to begin processing:
   - Forward the images to the Payment Processor API
   - Send the session ID, description, customer email, and customer name
   - URL: `https://payment-processor-856401495068.us-central1.run.app/api/appraisals`

## Response Format

The API should respond with a JSON object:

```json
{
  "success": true,
  "message": "Appraisal created successfully",
  "data": {
    "id": "123", // The ID of the newly created appraisal in the Google Sheet
    "sessionId": "abc123"
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "message": "Failed to create appraisal: [error details]"
}
```

## Error Handling

The API should return appropriate HTTP status codes:
- 400 Bad Request: Missing required fields or invalid data
- 500 Internal Server Error: Error while saving to Google Sheet or communicating with the Payment Processor

## Security Considerations

- The endpoint should be accessible only to authenticated appraisers
- Validate file types and sizes for uploaded images
- Sanitize and validate all user inputs 
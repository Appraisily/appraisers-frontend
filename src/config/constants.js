export const API_ROUTES = {
  AUTH: {
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
    PROCESS_FROM_STEP: '/api/appraisals/:id/process-from-step',
    SEND_CONFIRMATION_EMAIL: '/api/appraisals/:id/send-confirmation-email'
  }
};
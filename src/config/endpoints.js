import { API_ROUTES } from './constants';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout'
  },
  APPRAISALS: {
    LIST: '/api/appraisals',
    COMPLETED: '/api/appraisals/completed',
    CLEANUP_MOVED: '/api/appraisals/cleanup-moved-completed',
    DETAILS: (id) => `/api/appraisals/${id}/list`,
    DETAILS_EDIT: (id) => `/api/appraisals/${id}/list-edit`,
    SET_VALUE: (id) => `/api/appraisals/${id}/set-value`,
    COMPLETE_PROCESS: (id) => `/api/appraisals/${id}/complete-process`,
    PROCESS_WORKER: '/api/appraisals/process-worker',
    COMPLETED_DETAILS: (id) => `/api/appraisals/${id}/details`,
    REPROCESS_STEP: (id) => `/api/appraisals/${id}/reprocess-step`,
    COMPLETE: (id) => `/api/appraisals/${id}/complete-process`,
    BY_SESSION_ID: (sessionId) => `/api/appraisals/session/${sessionId}`,
    BULK_IMAGES: (id) => `/api/appraisals/${id}/bulk-images`,
    PROCESS_BULK: (id) => `/api/appraisals/${id}/process-bulk`,
    PDF_STEPS: '/api/appraisals/pdf-steps',
    GENERATE_PDF_STEPS: '/api/appraisals/generate-pdf-steps',
    PROCESS_STEPS: '/api/appraisals/process-steps',
    PROCESS_FROM_STEP: (id) => `/api/appraisals/${id}/process-from-step`,
    REPROCESS_COMPLETED: (id) => `/api/appraisals/${id}/reprocess-completed`,
    SEND_CONFIRMATION_EMAIL: (id) => `/api/appraisals/${id}/send-confirmation-email`,
    NEW_APPRAISAL: '/api/appraisals/new'
  }
};
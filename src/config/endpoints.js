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
    COMPLETE: (id) => `${API_BASE_URL}${API_ROUTES.APPRAISALS.COMPLETE_PROCESS.replace(':id', id)}`,
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
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
    COMPLETE_PROCESS: '/api/appraisals/:id/complete-process',
    SET_VALUE: '/api/appraisals/:id/set-value'
  }
};
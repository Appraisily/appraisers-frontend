import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const getPending = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.LIST);
    // Map backend field names to frontend expected names
    const appraisals = Array.isArray(response.data) ? response.data.map(item => {
      // Prioritize descriptions in this order: customer > ia > appraiser
      const bestDescription = 
        (item.customerDescription && item.customerDescription.trim()) ||
        (item.iaDescription && item.iaDescription.trim()) || 
        (item.appraisersDescription && item.appraisersDescription.trim()) ||
        'No description available';
      
      return {
        ...item,
        name: item.name || item.appraisalType || 'Standard',
        type: item.type || item.appraisalType || 'Standard',
        description: bestDescription,
        customer_name: item.customer_name || item.customerName || 'Unknown'
      };
    }) : [];
    return appraisals;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to fetch pending appraisals');
  }
};

export const getCompleted = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.COMPLETED);
    // Map backend field names to frontend expected names
    const appraisals = Array.isArray(response.data) ? response.data.map(item => {
      // Prioritize descriptions in this order: customer > ia > appraiser
      const bestDescription = 
        (item.customerDescription && item.customerDescription.trim()) ||
        (item.iaDescription && item.iaDescription.trim()) || 
        (item.appraisersDescription && item.appraisersDescription.trim()) ||
        'No description available';
      
      return {
        ...item,
        name: item.name || item.appraisalType || 'Standard',
        type: item.type || item.appraisalType || 'Standard',
        description: bestDescription,
        customer_name: item.customer_name || item.customerName || 'Unknown'
      };
    }) : [];
    return appraisals;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to fetch completed appraisals');
  }
};

export const getDetails = async (id) => {
  try {
    // Use the correct endpoint for details
    const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS(id));
    console.log('API Response for getDetails:', {
      ...response.data,
      gcsBackupUrl: response.data.gcsBackupUrl || 'Not provided'
    });
    return response.data;
  } catch (error) {
    console.error('Error details:', error);
    console.error('Response data:', error.response?.data);
    throw new Error(error.message || 'Failed to fetch appraisal details');
  }
};

export const getCompletedAppraisalDetails = async (id) => {
  try {
    // Use the new endpoint for completed appraisal details
    const response = await api.get(ENDPOINTS.APPRAISALS.COMPLETED_DETAILS(id));
    console.log('API Response for getCompletedAppraisalDetails:', response.data);
    return response.data.appraisalDetails;
  } catch (error) {
    console.error('Error fetching completed appraisal details:', error);
    console.error('Response data:', error.response?.data);
    throw new Error(error.message || 'Failed to fetch completed appraisal details');
  }
};

export const getDetailsForEdit = async (id) => {
  try {
    // Use the edit endpoint that provides additional form values
    const response = await api.get(ENDPOINTS.APPRAISALS.DETAILS_EDIT(id));
    console.log('API Response for getDetailsForEdit:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching edit details:', error);
    console.error('Response data:', error.response?.data);
    throw new Error(error.message || 'Failed to fetch appraisal edit details');
  }
};

export const updateAppraisal = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINTS.APPRAISALS.LIST}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating appraisal:', error);
    throw new Error(error.message || 'Failed to update appraisal');
  }
};

export const updatePendingAppraisal = async (data) => {
  try {
    const response = await api.post(`${ENDPOINTS.APPRAISALS.LIST}/pending`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating pending appraisal:', error);
    throw new Error(error.message || 'Failed to update pending appraisal');
  }
};

export const moveToCompleted = async (id) => {
  try {
    const response = await api.post(`${ENDPOINTS.APPRAISALS.MOVE_TO_COMPLETED(id)}`);
    return response.data;
  } catch (error) {
    console.error('Error moving appraisal to completed:', error);
    throw new Error(error.message || 'Failed to move appraisal to completed');
  }
};

export const setValue = async (id, appraisalValue, description, isEdit) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.SET_VALUE(id), {
      appraisalValue,
      description,
      isEdit
    });
    return response.data;
  } catch (error) {
    console.error('Error setting value:', error);
    throw new Error(error.message || 'Failed to set appraisal value');
  }
};

export const proposeValue = async (appraiserDescription, customerDescription, aiDescription) => {
  try {
    const response = await api.post(`${ENDPOINTS.APPRAISALS.LIST}/propose-value`, {
      appraiserDescription,
      customerDescription,
      aiDescription
    });
    return response.data;
  } catch (error) {
    console.error('Error proposing value:', error);
    throw new Error(error.message || 'Failed to propose appraisal value');
  }
};

export const completeProcess = async (id, appraisalValue, description, appraisalType) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.COMPLETE_PROCESS(id), {
      appraisalValue,
      description,
      appraisalType
    });
    return response.data;
  } catch (error) {
    console.error('Error completing process:', error);
    throw new Error(error.message || 'Failed to complete appraisal process');
  }
};

export const completeAppraisal = async (id, appraisalValue, description, appraisalType) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.COMPLETE(id), {
      appraisalValue,
      description,
      appraisalType
    });
    return response.data;
  } catch (error) {
    console.error('Error completing appraisal:', error);
    throw new Error(error.message || 'Failed to complete appraisal');
  }
};

// New methods for step-specific processing

export const getPdfSteps = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.PDF_STEPS);
    return response.data;
  } catch (error) {
    console.error('Error fetching PDF steps:', error);
    throw new Error(error.message || 'Failed to fetch PDF steps');
  }
};

export const generatePdfSteps = async (postId, sessionId, startStep, options) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.GENERATE_PDF_STEPS, {
      postId,
      session_ID: sessionId,
      startStep,
      options
    });
    return response.data;
  } catch (error) {
    console.error('Error generating PDF with steps:', error);
    throw new Error(error.message || 'Failed to generate PDF with steps');
  }
};

export const getProcessSteps = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.PROCESS_STEPS);
    return response.data;
  } catch (error) {
    console.error('Error fetching process steps:', error);
    throw new Error(error.message || 'Failed to fetch process steps');
  }
};

export const processFromStep = async (id, startStep, options) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.PROCESS_FROM_STEP.replace(':id', id), {
      startStep,
      options
    });
    return response.data;
  } catch (error) {
    console.error('Error processing from step:', error);
    throw new Error(error.message || 'Failed to process from step');
  }
};

export const reprocessStep = async (id, stepName) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.REPROCESS_STEP(id), {
      stepName
    });
    return response.data;
  } catch (error) {
    console.error('Error reprocessing step:', error);
    // Extract detailed message from backend response if available
    const message = 
      error.response?.data?.message ||  // Check backend response data first
      error.message ||                   // Fallback to Axios error message
      'Failed to reprocess step';        // Final fallback
    throw new Error(message);
  }
};

export const getBySessionId = async (sessionId) => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.BY_SESSION_ID(sessionId));
    if (!response.data) {
      throw new Error('No data returned for session ID');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching appraisal by session ID:', error);
    throw new Error(error.message || 'Failed to fetch appraisal by session ID');
  }
};

// New function to reprocess a completed appraisal
export const reprocessCompletedAppraisal = async (id) => {
  try {
    console.log(`Initiating complete reprocessing for appraisal ${id}`);
    
    // Check if the backend URL is properly configured
    if (!import.meta.env.VITE_BACKEND_URL) {
      console.error('VITE_BACKEND_URL environment variable is not defined. This is required for API calls.');
      throw new Error('Backend URL configuration error (VITE_BACKEND_URL is not defined). Please check your environment variables.');
    }
    
    // Use the process-from-step endpoint instead of reprocess-completed
    const endpoint = ENDPOINTS.APPRAISALS.PROCESS_FROM_STEP(id);
    console.log('Using endpoint for reprocessing:', endpoint);
    
    // Use the first step in the processing flow to restart the entire process
    const response = await api.post(endpoint, {
      startStep: 'STEP_SET_VALUE', // Using the correct step name format from backend
      options: {
        reprocessStatistics: true,
        regeneratePdf: true
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error reprocessing completed appraisal:', error);
    throw error;
  }
};

export const cleanupMovedToCompleted = async () => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.CLEANUP_MOVED);
    return response.data;
  } catch (error) {
    console.error('Error cleaning up moved to completed entries:', error);
    throw new Error(error.message || 'Failed to clean up moved to completed entries');
  }
};

// New method to send confirmation email
export const sendConfirmationEmail = async (id) => {
  try {
    console.log(`Sending confirmation email for appraisal ${id}`);
    const response = await api.post(ENDPOINTS.APPRAISALS.SEND_CONFIRMATION_EMAIL(id));
    return response.data;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error(error.message || 'Failed to send confirmation email');
  }
};

// New method to create an appraisal
export const createAppraisal = async (formData) => {
  try {
    console.log('Creating new appraisal with form data');
    const response = await api.post(ENDPOINTS.APPRAISALS.NEW_APPRAISAL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating new appraisal:', error);
    throw new Error(error.message || 'Failed to create new appraisal');
  }
};

export const removeAppraisal = async (id) => {
  try {
    console.log(`Removing appraisal with ID: ${id}`);
    const response = await api.post(ENDPOINTS.APPRAISALS.REMOVE(id));
    return response.data;
  } catch (error) {
    console.error('Error removing appraisal:', error);
    throw new Error(error.message || 'Failed to remove appraisal');
  }
};
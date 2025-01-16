import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const getPending = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.LIST);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to fetch pending appraisals');
  }
};

export const getCompleted = async () => {
  try {
    const response = await api.get(ENDPOINTS.APPRAISALS.COMPLETED);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to fetch completed appraisals');
  }
};

export const getDetails = async (id) => {
  try {
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

export const getBySessionId = async (sessionId) => {
  try {
    console.log('appraisalService: Fetching appraisal by sessionId:', sessionId);
    const response = await api.get(`${ENDPOINTS.APPRAISALS.LIST}?sessionId=${sessionId}`);
    console.log('appraisalService: Response data:', response.data);

    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('appraisalService: Found appraisal:', response.data[0]);
      return response.data[0];
    }
    console.log('appraisalService: No appraisal found for sessionId');
    throw new Error('Appraisal not found');
  } catch (error) {
    console.error('Error fetching appraisal by session ID:', error);
    console.error('appraisalService: Full error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw new Error(error.message || 'Failed to fetch appraisal');
  }
};

export const setValue = async (id, appraisalValue, description) => {
  try {
    const response = await api.post(ENDPOINTS.APPRAISALS.SET_VALUE(id), {
      appraisalValue,
      description
    });
    return response.data;
  } catch (error) {
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to update appraisal');
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
    console.error('Error details:', error);
    throw new Error(error.message || 'Failed to complete appraisal');
  }
};
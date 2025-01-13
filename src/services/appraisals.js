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
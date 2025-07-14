import axiosInstance from '../utils/axiosConfig';

export const updateContest = async (contestId, contestData) => {
  try {
    const formData = new FormData();
    Object.keys(contestData).forEach(key => {
      if (key === 'thumbnail' && contestData[key]) {
        formData.append('thumbnail', contestData[key]);
      } else if (contestData[key] !== null && contestData[key] !== undefined) {
        formData.append(key, contestData[key]);
      }
    });

    const response = await axiosInstance.put(`/brand/contests/${contestId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating contest:', error);
    throw error;
  }
};

export const createContest = async (contestData) => {
  try {
    const formData = new FormData();
    Object.keys(contestData).forEach(key => {
      if (key === 'thumbnail' && contestData[key]) {
        formData.append('thumbnail', contestData[key]);
      } else if (contestData[key] !== null && contestData[key] !== undefined) {
        formData.append(key, contestData[key]);
      }
    });

    const response = await axiosInstance.post('/brand/contests/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating contest:', error);
    throw error;
  }
};

export const getAllContests = async () => {
  try {
    const response = await axiosInstance.get('/contests/');
    return response.data;
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

export const getActiveContests = async () => {
  try {
    const response = await axiosInstance.get('/contests/active/');
    return response.data;
  } catch (error) {
    console.error('Error fetching active contests:', error);
    throw error;
  }
};

export const getContestById = async (id) => {
  try {
    const response = await axiosInstance.get(`/contests/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contest ${id}:`, error);
    throw error;
  }
};

export const submitToContest = async (contestId, formData) => {
  try {
    const response = await axiosInstance.post(`/contests/${contestId}/submit/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting to contest:', error);
    throw error;
  }
};

export const applyToContest = async (contestId, applicationData) => {
  try {
    const response = await axiosInstance.post(`/contests/${contestId}/apply/`, applicationData);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      // Server responded with error
      console.error('Error applying to contest:', error.response.data);
      const errorMessage = error.response.data.detail || 
        (error.response.data.terms_accepted && 'Terms must be accepted') ||
        (error.response.data.contest && 'Invalid contest application') ||
        'Failed to apply to contest';
      throw new Error(errorMessage);
    }
    console.error('Error applying to contest:', error);
    throw new Error('Network error while applying to contest');
  }
};

export const getContestApplication = async (contestId) => {
  try {
    const response = await axiosInstance.get(`/contests/${contestId}/application/`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null; // No application exists
    }
    console.error('Error fetching contest application:', error);
    throw error;
  }
};

export const getCreatorApplicationStatus = async (contestId) => {
  try {
    const response = await axiosInstance.get(`/contests/${contestId}/application-status/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching application status:', error);
    throw error;
  }
};

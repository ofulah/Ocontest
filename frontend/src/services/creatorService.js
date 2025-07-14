import axiosInstance from '../utils/axiosConfig';

// Transform creator profile data into a consistent format
const transformCreatorProfile = (profile) => {
  if (!profile) return null;
  return {
    id: profile.id || null,
    name: profile.name || 'Unknown Creator',
    profilePicture: profile.profile_picture || '',
    bio: profile.bio || '',
    country: profile.country || '',
    experienceLevel: profile.experience_level || null,
    address: profile.address || '',
    portfolio_url: profile.portfolio_url || '',
    social_media_links: profile.social_media_links || {}
  };
};

// Transform video data into a consistent format
const transformVideo = (video) => {
  if (!video) return null;
  try {
    return {
      id: video.id,
      title: video.title || '',
      description: video.description || '',
      video_url: video.video_url || '',
      thumbnail_url: video.thumbnail_url || '',
      status: video.status || 'pending',
      status_display: video.status_display || '',
      created_at: video.created_at ? new Date(video.created_at).toISOString() : null,
      creator: transformCreatorProfile(video.creator) || null
    };
  } catch (error) {
    console.error('Error transforming video:', error);
    return null;
  }
};

// Transform submission data into a consistent format
const transformSubmission = (submission) => {
  if (!submission) return null;
  try {
    return {
      id: submission.id,
      title: submission.title || '',
      description: submission.description || '',
      video_url: submission.video_url || '',
      thumbnail_url: submission.thumbnail_url || '',
      status: submission.status || 'pending',
      status_display: submission.status_display || '',
      created_at: submission.created_at ? new Date(submission.created_at).toISOString() : null,
      creator: transformCreatorProfile(submission.creator) || null,
      contest: submission.contest ? {
        id: submission.contest.id,
        title: submission.contest.title || '',
        brand: submission.contest.brand ? transformCreatorProfile(submission.contest.brand) : null
      } : null
    };
  } catch (error) {
    console.error('Error transforming submission:', error);
    return null;
  }
};

export const getCreatorStats = async () => {
  try {
    const response = await axiosInstance.get('/accounts/creators/stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching creator stats:', error);
    throw error;
  }
};

export const getCreatorVideos = async () => {
  try {
    const response = await axiosInstance.get('/accounts/creators/videos/');
    return Array.isArray(response.data.videos) ? response.data.videos.map(transformVideo).filter(Boolean) : [];
  } catch (error) {
    console.error('Error fetching creator videos:', error);
    throw error;
  }
};

export const getCreatorSubmissions = async () => {
  try {
    const response = await axiosInstance.get('/accounts/creators/submissions/');
    return Array.isArray(response.data.submissions) ? response.data.submissions.map(transformSubmission).filter(Boolean) : [];
  } catch (error) {
    console.error('Error fetching creator submissions:', error);
    throw error;
  }
};

export const getCreatorEarnings = async () => {
  try {
    const response = await axiosInstance.get('/accounts/creators/earnings/');
    return {
      total_earnings: response.data.total_earnings || 0,
      earnings_breakdown: Array.isArray(response.data.earnings_breakdown) ? response.data.earnings_breakdown : []
    };
  } catch (error) {
    console.error('Error fetching creator earnings:', error);
    throw error;
  }
};

export const updateCreatorProfile = async (formData) => {
  try {
    const response = await axiosInstance.put('/creators/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformCreatorProfile(response.data);
  } catch (error) {
    console.error('Error updating creator profile:', error);
    throw error.response?.data || error;
  }
};

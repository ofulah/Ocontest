import axiosInstance from '../utils/axiosConfig';

// Use the shared axios instance from axiosConfig.js
const api = axiosInstance;

// Video API
export const videoApi = {
  // Upload a new video
  uploadVideo: async (formData, onUploadProgress) => {
    try {
      const response = await api.post('/videos/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Get all videos for the current user (both standalone and contest videos)
  getMyVideos: async () => {
    try {
      // First try to get videos from the dashboard endpoint
      const dashboardResponse = await api.get('/creator/dashboard/');
      
      // Extract videos from dashboard response if available
      if (dashboardResponse?.data?.videos && Array.isArray(dashboardResponse.data.videos)) {
        return dashboardResponse.data.videos.map(video => ({
          ...video,
          type: video.contest_id ? 'contest' : 'standalone'
        }));
      }
      
      // Fallback: Fetch both standalone videos and contest submissions separately
      const [standaloneResponse, contestSubmissionsResponse] = await Promise.all([
        api.get('/videos/videos/', {
          params: {
            is_standalone: 'true',
          },
        }),
        api.get('/creators/submissions/')
      ]);
      
      // Process standalone videos
      const standaloneVideos = Array.isArray(standaloneResponse?.data) 
        ? standaloneResponse.data.map(video => ({
            ...video,
            type: 'standalone',
            thumbnail_url: video.thumbnail ? `http://localhost:8000${video.thumbnail}` : null
          }))
        : [];
      
      // Process contest submission videos
      const contestSubmissions = Array.isArray(contestSubmissionsResponse?.data)
        ? contestSubmissionsResponse.data
        : [];
      
      const contestVideos = contestSubmissions
        .filter(submission => submission) // Make sure submission exists
        .map(submission => {
          // Handle different data structures
          const videoData = submission.video || submission;
          const contestData = submission.contest || {};
          
          return {
            id: videoData.id || submission.id,
            title: videoData.title || submission.title,
            description: videoData.description || submission.description,
            thumbnail: videoData.thumbnail || submission.thumbnail,
            thumbnail_url: videoData.thumbnail ? `http://localhost:8000${videoData.thumbnail}` : 
                          submission.thumbnail ? `http://localhost:8000${submission.thumbnail}` : null,
            views: videoData.views || videoData.view_count || submission.view_count || 0,
            likes: videoData.likes || 0,
            created_at: videoData.created_at || submission.created_at,
            contestId: contestData.id || submission.contest_id,
            contestTitle: contestData.title,
            submissionId: submission.id,
            submissionDate: submission.created_at || submission.submission_date,
            type: 'contest'
          };
        });
      
      // Combine both types of videos
      return [...standaloneVideos, ...contestVideos];
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Return empty arrays for both types if there's an error
      return [];
    }
  },
  
  // Get all contests the user has participated in
  getMyContests: async () => {
    try {
      // Get contests from the dashboard endpoint which we know works
      const response = await api.get('/creator/dashboard/');
      
      // Extract contests from the dashboard response
      const { 
        active_contests = [], 
        applied_contests = [], 
        past_contests = [],
        running_contests = [] // Some APIs might use this name instead
      } = response.data || {};
      
      // Use running_contests if active_contests is empty
      const activeContests = active_contests.length > 0 ? active_contests : running_contests;
      
      // Combine all contests and add a status field
      const allContests = [
        ...(activeContests || []).map(contest => ({
          ...contest,
          status: 'active'
        })),
        ...(applied_contests || []).map(contest => ({
          ...contest,
          status: 'applied'
        })),
        ...(past_contests || []).map(contest => ({
          ...contest,
          status: 'past'
        }))
      ];
      
      return allContests;
    } catch (error) {
      console.error('Error fetching contests:', error);
      return [];
    }
  },

  // Get a single video by ID
  getVideoById: async (id) => {
    try {
      const response = await api.get(`/videos/videos/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },

  // Update a video
  updateVideo: async (id, data) => {
    try {
      const response = await api.put(`/videos/videos/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  // Delete a video
  deleteVideo: async (id) => {
    try {
      await api.delete(`/videos/videos/${id}/`);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },
};

export default api;

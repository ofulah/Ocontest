import axiosInstance from '../utils/axiosConfig';

// Fallback sample videos in case API fails
const sampleVideos = [
  {
    id: 1,
    title: "RED by Riz",
    description: "A vibrant exploration of the color red through motion and design.",
    url: "/videos/library/RED-_-Riz.mp4",
    thumbnail: "/videos/library/RED-_-Riz.mp4",
    creator: {
      name: "Riz",
      profilePicture: "/images/creators/riz.jpg",
      country: "United States",
      bio: "Motion graphics artist specializing in color theory and abstract design."
    },
    category: "motion_graphics",
    views: 1200,
    likes: 89,
    duration: "1:45"
  },
  {
    id: 2,
    title: "YELLOW by Jordan Biagomala",
    description: "An artistic journey through yellow tones and abstract shapes.",
    url: "/videos/library/YELLOW-_-Jordan-Biagomala.mp4",
    thumbnail: "/videos/library/YELLOW-_-Jordan-Biagomala.mp4",
    creator: {
      name: "Jordan Biagomala",
      profilePicture: "/images/creators/jordan.jpg",
      country: "Canada",
      bio: "Experimental animator pushing the boundaries of digital art."
    },
    category: "animation",
    views: 950,
    likes: 76,
    duration: "2:10"
  },
  {
    id: 3,
    title: "Directors Vision",
    description: "Behind the scenes look at a directors creative process.",
    url: "/videos/library/director-holding.mp4",
    thumbnail: "/videos/library/director-holding.mp4",
    creator: {
      name: "FilmCraft",
      profilePicture: "/images/creators/filmcraft.jpg",
      country: "United Kingdom",
      bio: "Documentary filmmakers capturing the essence of creative processes."
    },
    category: "documentary",
    views: 2100,
    likes: 156,
    duration: "1:30"
  },
  {
    id: 4,
    title: "Dance in the City",
    description: "Spontaneous urban dance performance capturing joy and freedom.",
    url: "/videos/library/female-tourist-dancing.mp4",
    thumbnail: "/videos/library/female-tourist-dancing.mp4",
    creator: {
      name: "UrbanLens",
      profilePicture: "/images/creators/urbanlens.jpg",
      country: "France",
      bio: "Street photography and videography collective capturing urban life."
    },
    category: "performance",
    views: 1800,
    likes: 142,
    duration: "1:20"
  },
  {
    id: 5,
    title: "Light & Shadow",
    description: "Experimental photography with dramatic lighting techniques.",
    url: "/videos/library/lighting-photography.mp4",
    thumbnail: "/videos/library/lighting-photography.mp4",
    creator: {
      name: "LightCraft",
      profilePicture: "/images/creators/lightcraft.jpg",
      country: "Japan",
      bio: "Experimental photographer exploring light and shadow."
    },
    category: "experimental",
    views: 890,
    likes: 67,
    duration: "1:15"
  },
  {
    id: 6,
    title: "Venice Beach Vibes",
    description: "A day in the life at the iconic Venice Beach.",
    url: "/videos/library/sunaofe._venice_beach-1080p_1.mp4",
    thumbnail: "/videos/library/sunaofe._venice_beach-1080p_1.mp4",
    creator: {
      name: "Sunaofe",
      profilePicture: "/images/creators/sunaofe.jpg",
      country: "United States",
      bio: "Documentary filmmaker capturing life's beautiful moments."
    },
    category: "documentary",
    views: 3200,
    likes: 245,
    duration: "2:30"
  }
];

const transformVideoData = (video) => {
  if (!video) return null;

  // Transform creator data into a flattened structure
  const transformedVideo = {
    ...video,
    creator: (() => {
      if (video.creator_profile) {
        const name = `${video.creator_profile.first_name || ''} ${video.creator_profile.last_name || ''}`.trim() || 'Unknown Creator';
        return name;
      } else if (typeof video.creator === 'string') {
        return video.creator;
      } else if (video.creator && typeof video.creator === 'object') {
        return video.creator.name || 'Unknown Creator';
      } else {
        return 'Unknown Creator';
      }
    })(),
    creator_profile: video.creator_profile ? {
      id: video.creator_profile.id,
      experienceLevel: video.creator_profile.experience_level || null,
      profilePicture: video.creator_profile.profile_picture || '',
      country: video.creator_profile.country || '',
      bio: video.creator_profile.bio || ''
    } : null
  };

  return transformedVideo;
};

export const getFeaturedVideos = async () => {
  try {
    // Instead of using featured videos endpoint, get the 6 most recent videos from the main videos endpoint
    const response = await axiosInstance.get('/videos/videos/', {
      params: {
        is_approved: 'true',
        limit: 6,
        ordering: '-created_at' // Order by most recent first
      }
    });
    console.log('Recent videos response:', response.data);
    
    // Handle the response data
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    } else if (response.data && response.data.videos && typeof response.data.videos === 'string') {
      // If we got API URLs instead of data, make a second request to the videos endpoint
      try {
        // Remove any leading /api/ from the URL since axiosInstance already includes it
        const videosUrl = response.data.videos.replace(/^\/api\//, '/');
        const videosResponse = await axiosInstance.get(`${videosUrl}?limit=6&ordering=-created_at&is_approved=true`);
        return Array.isArray(videosResponse.data) ? videosResponse.data : 
               (videosResponse.data && Array.isArray(videosResponse.data.results)) ? videosResponse.data.results : [];
      } catch (innerError) {
        console.error('Error fetching from videos URL:', innerError);
        return [];
      }
    }
    
    // Fallback to empty array instead of sample videos
    return [];
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return []; // Return empty array instead of sample videos
  }
};

export const getVideoById = async (id) => {
  try {
    // Use the correct endpoint structure based on the router configuration
    const response = await axiosInstance.get(`/videos/videos/${id}/`);
    return transformVideoData(response.data);
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

export const getVideosByStatus = async (status) => {
  try {
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.get(`/videos/search/?q=${status}`);
    return response.data.map(transformVideoData);
  } catch (error) {
    console.error('Error fetching videos by status:', error);
    // Return empty array instead of sample videos
    return [];
  }
};

export const searchVideos = async (query) => {
  try {
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.get('/videos/search/', {
      params: { query }
    });
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data.map(transformVideoData);
    } else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results.map(transformVideoData);
    } else {
      console.warn('Unexpected response format from search API:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error searching videos:', error);
    return []; // Return empty array instead of sample videos
  }
};

export const getVideosByCreator = async (creatorId, currentVideoId) => {
  try {
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.get(`/videos/creator/${creatorId}/`, {
      params: { exclude: currentVideoId }
    });
    return response.data.map(transformVideoData);
  } catch (error) {
    console.error('Error fetching creator videos:', error);
    throw error;
  }
};

export const getAllVideos = async () => {
  try {
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.get('/videos/videos/', {
      params: {
        is_approved: 'true', // Only get approved videos
        ordering: '-created_at' // Order by most recent first
      }
    });
    
    console.log('All videos response:', response.data);
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data.map(transformVideoData);
    } 
    // Handle paginated response
    else if (response.data && Array.isArray(response.data.results)) {
      return response.data.results.map(transformVideoData);
    } 
    // Handle API root response with URLs
    else if (response.data && response.data.videos && typeof response.data.videos === 'string') {
      console.log('Received API URLs, fetching from videos endpoint:', response.data.videos);
      try {
        // Make a second request to the videos endpoint
        // Remove any leading /api/ from the URL since axiosInstance already includes it
        const videosUrl = response.data.videos.replace(/^\/api\//, '/');
        const videosResponse = await axiosInstance.get(`${videosUrl}?ordering=-created_at&is_approved=true`);
        
        if (Array.isArray(videosResponse.data)) {
          return videosResponse.data.map(transformVideoData);
        } else if (videosResponse.data && Array.isArray(videosResponse.data.results)) {
          return videosResponse.data.results.map(transformVideoData);
        }
      } catch (innerError) {
        console.error('Error fetching from videos endpoint:', innerError);
      }
      return []; // Return empty array instead of sample videos
    }
    // Fallback
    else {
      console.warn('API response is not in expected format:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return []; // Return empty array instead of sample videos
  }
};

export const uploadVideo = async (videoData) => {
  try {
    const formData = new FormData();
    Object.keys(videoData).forEach(key => formData.append(key, videoData[key]));
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.post('/videos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

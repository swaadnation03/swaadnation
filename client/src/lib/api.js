// // API Base URL - Changes based on environment
// const getApiUrl = () => {
//   // Production (Vercel/Render)
//   if (process.env.NODE_ENV === 'production') {
//     return process.env.NEXT_PUBLIC_API_URL || 'https://swaadnation-api.onrender.com';
//   }
//   // Development (localhost)
//   return 'http://localhost:5000';
// };

// export const API_URL = getApiUrl();

// // Helper function for API calls
// export const apiFetch = async (endpoint, options = {}) => {
//   const url = `${API_URL}${endpoint}`;
//   const response = await fetch(url, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   });
//   return response;
// };




// API Base URL - Changes based on environment
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://swaadnation-api.onrender.com';
  }
  return 'http://localhost:5000';
};

export const API_URL = getApiUrl();

// ✅ Network errors now throw a clean message instead of crashing silently
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response;
  } catch (error) {
    // fetch() only throws on network failure (server down, no internet)
    // HTTP error codes (400, 500) still return normally — caller checks res.ok
    throw new Error(
      error instanceof Error
        ? `Network error: ${error.message}`
        : 'Network error: Unable to reach the server'
    );
  }
};
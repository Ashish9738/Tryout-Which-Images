// Api.js
export const fetchModels = async () => {
  try {
    const response = await fetch('http://192.168.43.47:3000/models');
    if (!response.ok) {
      throw new Error('Failed to fetch model data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
};



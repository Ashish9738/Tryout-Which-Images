export const fetchModels = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://127.0.0.1:8000/model');
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data = await response.json();
    return data;
  } catch (error: any) { 
    if (error instanceof Error) {
      throw new Error(`Error fetching models: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};
export const api = 'http://10.0.2.2:8000';

export const fetchModels = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${api}/models`);
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

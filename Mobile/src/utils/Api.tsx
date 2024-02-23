export const fetchModels = async (): Promise<any[]> => {
  try {
    const response = await fetch('http://localHost/api/model');
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const data: any[] = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error fetching models: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

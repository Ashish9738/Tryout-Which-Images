export const api = 'http://10.0.2.2:8000';
export const fetchModelDetails = 'https://cia-mas.cialabs.tech/';

export const fetchModels = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${api}/select_option?query=model`);
    if (!response.ok) {
      throw new Error('Failed to fetch odels');
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    if (error instanceof Error) {
      throw new Error(`Error fetching models: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

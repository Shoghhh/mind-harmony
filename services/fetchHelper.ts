import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://example.com/api';

export const fetchHelper = async <T>(
  endpoint: string,
  method: string = 'GET',
  body: any = null,
  headers: HeadersInit = {}
): Promise<T> => {
  try {
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T; 
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

import Constants from 'expo-constants';
import { WeatherAPIResponse } from '../types';

const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra;

const WEATHER_API_URL = extra?.WEATHER_API_URL;
const WEATHER_API_KEY = extra?.WEATHER_API_KEY;

export const fetchCurrentWeather = async (
  location: string,
): Promise<WeatherAPIResponse> => {
  if (!WEATHER_API_URL || !WEATHER_API_KEY) {
    throw new Error('Weather API URL or Key is not configured.');
  }

  const apiUrl = `${WEATHER_API_URL}${WEATHER_API_KEY}&q=${location}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText,
      }));

      throw new Error(
        `Failed to fetch weather data! Message: ${errorData.message} - status: ${response.status} - `,
      );
    }
    const data: WeatherAPIResponse = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in fetchCurrentWeather: ${error}`);
    throw error;
  }
};

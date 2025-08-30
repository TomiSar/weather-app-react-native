import Constants from 'expo-constants';
const { WEATHER_API_URL, WEATHER_API_KEY } = Constants.manifest.extra;

export const fetchCurrentWeather = async (location: string) => {
  const response = await fetch(
    `${WEATHER_API_URL}${WEATHER_API_KEY}&q=${location}`
  );
  return response.json();
};

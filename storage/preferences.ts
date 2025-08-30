import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveHomeCity = async (city: string) => {
  await AsyncStorage.setItem('homeCity', city);
};

export const getHomeCity = async () => {
  return await AsyncStorage.getItem('homeCity');
};

export const deleteHomeCity = async () => {
  await AsyncStorage.removeItem('homeCity');
};

export const updateHomeCity = async (newCity: string): Promise<void> => {
  await AsyncStorage.clear();
  await saveHomeCity(newCity);
};

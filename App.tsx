import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchCurrentWeather } from './services/weatherApi';
import { WeatherAPIResponse } from './types';
import { deleteHomeCity, getHomeCity, saveHomeCity } from './storage/preferences';

export default function App() {
  const [city, setCity] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [hasLoadedInitialCity, setHasLoadedInitialCity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      const savedCity = await getHomeCity();
      if (savedCity) {
        setHomeCity(savedCity);
      }
      setHasLoadedInitialCity(true);
    };
    loadInitialState();
  }, []);

  const handleSearchCity = async (searchCity?: string) => {
    const targetCity = searchCity || city;
    setInputError(null);
    setError(null);
    setWeather(null);

    if (!targetCity) {
      setInputError('Please enter a city name');
      return;
    }

    setLoading(true);

    try {
      const data: WeatherAPIResponse = await fetchCurrentWeather(targetCity);
      // desctrucuring
      const { location } = data;
      if (data && location && location.name) {
        setWeather(data);
        await saveHomeCity(targetCity);
        setHomeCity(targetCity);
      } else {
        // API Response Error
        throw new Error('Received unexpected weather data format.');
      }
    } catch (error: unknown) {
      console.error('Weather fetch failed:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch Weather data');
      }
      setWeather(null);
    } finally {
      setLoading(false);
      setCity('');
    }
  };

  const handleCityChange = (cityText: string) => {
    setCity(cityText);
    if (cityText) {
      setInputError(null);
    }
  };

  const handleRemoveHomeCity = async () => {
    await deleteHomeCity();
    setHomeCity('');
    setWeather(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Weather Application</Text>
      <Text style={styles.searchTitle}>Search weather in city</Text>
      <TextInput
        style={[styles.input, inputError ? styles.inputError : {}]}
        value={city}
        onChangeText={handleCityChange}
        placeholder='Enter City...'
      />
      {inputError && <Text style={styles.inputErrorMessage}>{inputError}</Text>}
      <TouchableOpacity style={styles.searchButton} onPress={() => handleSearchCity()}>
        <Text style={styles.buttonText}>Search weather</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemoveHomeCity}>
        <Text style={styles.buttonText}>Remove home city</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading && <Text>Loading...</Text>}

      {weather && hasLoadedInitialCity && weather.location && (
        <>
          <Text style={styles.searchResult}>Weather search result</Text>
          <View style={styles.result}>
            <Text>Country: {weather.location.country}</Text>
            <Text>City: {weather.location.name}</Text>
            <Text>Local time: {weather.location.localtime}</Text>
            <Text>Temperature: {weather.current.temp_c}°C</Text>
            <Text>Condition: {weather.current.condition.text}</Text>
            {homeCity && <Text>Home city: {homeCity}</Text>}
          </View>
        </>
      )}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginBottom: 50, paddingTop: 60 },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  inputErrorMessage: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  searchResult: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
  },
  result: { marginTop: 10 },
});

import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchCurrentWeather } from './services/weatherApi';
import { WeatherAPIResponse } from './types';
import {
  deleteHomeCity,
  getHomeCity,
  saveHomeCity,
} from './storage/preferences';
import SearchBar from './components/SearchBar';
import RemoveHomeCityButton from './components/RemoveHomeCityButton';
import WeatherResult from './components/WeatherResult';
import StatusDisplay from './components/StatusDisplay';

export default function App() {
  const [city, setCity] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialState = async () => {
      let savedHomeCity = await getHomeCity();

      if (savedHomeCity) {
        try {
          const data: WeatherAPIResponse = await fetchCurrentWeather(
            savedHomeCity,
          );
          const { location } = data;
          savedHomeCity =
            savedHomeCity !== location.name ? location.name : savedHomeCity;

          setHomeCity(savedHomeCity);
          setWeather(data);
        } catch (error) {
          console.error('Initial weather fetch failed:', error);
          setError('Could not load weather for saved city.');
        }
      }
    };
    loadInitialState();
  }, []);

  const handleSearchCity = async (searchCity?: string) => {
    let targetCity = searchCity || city;
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
        if (notification && notification !== '') {
          setNotification('');
        }
        targetCity = targetCity !== location.name ? location.name : targetCity;
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
    const savedHomeCity = await getHomeCity();
    if (!savedHomeCity) {
      setNotification('Empty city can not be removed.');
      return;
    }
    await deleteHomeCity();
    setHomeCity('');
    setWeather(null);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Weather Application</Text>
      <SearchBar
        styles={styles}
        city={city}
        inputError={inputError}
        onCityChange={handleCityChange}
        onSearchCity={() => handleSearchCity(city)}
      />
      <RemoveHomeCityButton styles={styles} onRemove={handleRemoveHomeCity} />
      <StatusDisplay
        styles={styles}
        notification={notification}
        error={error}
        loading={loading}
      />
      {weather && weather.location && (
        <>
          <WeatherResult
            styles={styles}
            weather={weather}
            homeCity={homeCity}
          />
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
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  notification: {
    fontSize: 18,
    color: 'orange',
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
  homeCity: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

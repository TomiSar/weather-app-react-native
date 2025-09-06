import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { fetchCurrentWeather } from './services/weatherApi';
import { WeatherAPIResponse } from './types';
import {
  deleteHomeCity,
  getHomeCity,
  saveHomeCity,
} from './storage/preferences';
import SearchBar from './components/SearchBar';
import WeatherResult from './components/WeatherResult';
import StatusDisplay from './components/StatusDisplay';
import HomeCityButton from './components/HomeCityButton';

export default function App() {
  const [city, setCity] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const TIMEOUT = 2000;

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

  const handleCityAction = async (
    city: string,
    updateCity: boolean = false,
  ) => {
    setInputError(null);
    setError(null);
    setWeather(null);

    if (!city || city.trim() === '') {
      setInputError('City cannot be empty');
      return;
    }
    setLoading(true);

    try {
      const data: WeatherAPIResponse = await fetchCurrentWeather(city);
      // desctrucuring
      const { location } = data;
      if (data && location && location.name) {
        if (notification) setNotification('');

        const homeCityName = city !== location.name ? location.name : city;

        setWeather(data);
        setHomeCity(homeCityName);
        await saveHomeCity(homeCityName);

        if (updateCity) {
          const updateSuccessMessage = `Homecity updated to ${homeCityName} successfully`;
          setNotification(updateSuccessMessage);
          setTimeout(() => {
            setNotification(null);
          }, TIMEOUT);
        }
      } else {
        // API Response Error
        throw new Error('Received unexpected weather data format.');
      }
    } catch (error: unknown) {
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

  // Wrapper methods
  const handleSearchCity = () => {
    handleCityAction(city);
  };

  const handleUpdateCity = () => {
    handleCityAction(city || homeCity, true);
  };

  const handleCityChange = (cityText: string) => {
    setCity(cityText);
    if (cityText) {
      setInputError(null);
    }
  };

  const handleRemoveCity = async () => {
    setNotification(`Home city ${homeCity} removed.`);
    await deleteHomeCity();
    setHomeCity('');
    setWeather(null);
    setError(null);
    setTimeout(() => setNotification(null), TIMEOUT);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.appTitle}>Weather Application</Text>
        <SearchBar
          styles={styles}
          city={city}
          inputError={inputError}
          onCityChange={handleCityChange}
          onSearchCity={handleSearchCity}
        />

        {homeCity && (
          <>
            <HomeCityButton
              styles={styles}
              label='Remove home city'
              variant='remove'
              opPress={handleRemoveCity}
            />
            <HomeCityButton
              styles={styles}
              label='Update home city'
              variant='update'
              opPress={handleUpdateCity}
            />
          </>
        )}

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
    </TouchableWithoutFeedback>
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
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

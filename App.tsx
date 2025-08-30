import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { fetchCurrentWeather } from './services/weatherApi';
import {
  deleteHomeCity,
  getHomeCity,
  saveHomeCity,
} from './storage/preferences';

export default function App() {
  const [city, setCity] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSavedCity = async () => {
      const savedCity = await getHomeCity();
      if (savedCity) {
        setCity(savedCity);
        setHomeCity(savedCity);
        handleSearch(savedCity);
      }
    };
    loadSavedCity();
  }, []);

  const handleSearch = async (searchCity?: string) => {
    const targetCity = searchCity || city;
    if (!targetCity) return;
    setLoading(true);
    try {
      const data = await fetchCurrentWeather(targetCity);
      setWeather(data);
      await saveHomeCity(targetCity);
      setHomeCity(targetCity);
    } catch (error) {
      console.error('Weather fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Enter City want to search weather broadcast
      </Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder='Enter City...'
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => handleSearch()}
      >
        <Text style={styles.buttonText}>Search weather</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteHomeCity()}
      >
        <Text style={styles.buttonText}>Clear home city</Text>
      </TouchableOpacity>

      {loading && <Text>Loading...</Text>}
      {weather && (
        <View style={styles.result}>
          <Text>City: {weather.location.name}</Text>
          <Text>Temperature: {weather.current.temp_c}°C</Text>
          <Text>Condition: {weather.current.condition.text}</Text>
          {homeCity && <Text>Home city: {homeCity}</Text>}
        </View>
      )}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  searchButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  result: { marginTop: 20 },
});

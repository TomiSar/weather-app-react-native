import { Text, View } from 'react-native';
import { WeatherAPIResponse } from '../types';

type WeatherResultProps = {
  styles: any;
  weather: WeatherAPIResponse;
  homeCity: string;
};

export default function WeatherResult({
  styles,
  weather,
  homeCity,
}: WeatherResultProps) {
  return (
    <View>
      <Text style={styles.searchResult}>
        Weather in {weather.location.name}
      </Text>
      <View style={styles.result}>
        <Text>Country: {weather.location.country}</Text>
        <Text>City: {weather.location.name}</Text>
        <Text>Local time: {weather.location.localtime}</Text>
        <Text>Temperature: {weather.current.temp_c}°C</Text>
        <Text>Condition: {weather.current.condition.text}</Text>
      </View>
      {homeCity && (
        <Text style={styles.homeCity}>Your current home city: {homeCity}</Text>
      )}
    </View>
  );
}

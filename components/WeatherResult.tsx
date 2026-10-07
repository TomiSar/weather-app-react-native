import { Image, Text, View } from 'react-native'; // StyleSheet,
import { WeatherAPIResponse } from '../types';
import { constructWeatherIconUrl, formatToLocalTime } from '../utils';

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
  const weatherIcon = constructWeatherIconUrl(weather.current.condition.icon);

  return (
    <View>
      <Text style={styles.searchResult}>
        Weather in {weather.location.name}
      </Text>
      <View style={styles.result}>
        <Text>Country: {weather.location.country}</Text>
        <Text>City: {weather.location.name}</Text>
        <Text>Region: {weather.location.region}</Text>
        <Text>Local time: {formatToLocalTime(weather.location.localtime)}</Text>
        <Text>Temperature: {weather.current.temp_c.toFixed(1)} °C</Text>
        <Text>Feels like: {weather.current.feelslike_c.toFixed(1)} °C</Text>
        <Text>Wind: {(weather.current.wind_kph / 3.6).toFixed(1)} m/s</Text>
        <View style={styles.searchContainer}>
          <Text>Condition: {weather.current.condition.text}</Text>
          {weatherIcon && (
            <Image
              source={{
                uri: weatherIcon,
              }}
              style={styles.resultIcon}
            />
          )}
        </View>
      </View>
      {homeCity && (
        <Text style={styles.homeCity}>
          Homecity: {homeCity} ({weather.location.country})
        </Text>
      )}
    </View>
  );
}

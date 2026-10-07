export default ({ config }) => {
  return {
    ...config,
    expo: {
      name: 'WeatherApp',
      slug: 'weatherapp',
      extra: {
        WEATHER_API_URL: process.env.WEATHER_API_URL,
        WEATHER_API_KEY: process.env.WEATHER_API_KEY,
        eas: {
          projectId: '5f138447-8ff3-4172-8ba6-15605e87ad1b',
        },
      },
      ios: {
        bundleIdentifier: 'com.senseiwithblackbelt.weatherapp',
      },
      android: {
        package: 'com.senseiwithblackbelt.weatherapp',
      },
      updates: {
        url: 'https://u.expo.dev/5f138447-8ff3-4172-8ba6-15605e87ad1b',
      },
      runtimeVersion: {
        policy: 'appVersion',
      },
      plugins: ['expo-status-bar'],
    },
  };
};

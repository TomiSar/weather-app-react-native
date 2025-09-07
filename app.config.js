export default {
  expo: {
    name: 'WeatherApp',
    slug: 'weatherapp',
    extra: {
      WEATHER_API_URL: 'https://api.weatherapi.com/v1/current.json?key=',
      WEATHER_API_KEY: '2fb05a991e204657a44225203252908',
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
  },
};

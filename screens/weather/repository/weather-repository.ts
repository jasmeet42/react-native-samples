import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData } from '../Weather';

export const getWeatherData = async () => {
  try {
    const weatherData = await AsyncStorage.getItem('weatherData');
    console.log('weatherData', weatherData);
    return weatherData ? JSON.parse(weatherData) : null;
  }
  catch (e) {
    console.error('Error getting weatherData', e);
  }
};

export const getWeatherTimeStamp = async () => {
  try {
    const weatherData = await AsyncStorage.getItem('weatherTimestamp');
    console.log('weatherTimestamp', weatherData);
    return weatherData ? JSON.parse(weatherData) : null;
  }
  catch (e) {
    console.error('Error getting weatherTimestamp', e);
  }
};

export const saveWeatherData = async (data: WeatherData) => {
  try {
    await AsyncStorage.setItem('weatherData', JSON.stringify(data));
    const now = Date.now();
    await AsyncStorage.setItem('weatherTimestamp', now.toString());
  }
  catch (e) {
    console.error('Error saving weatherData', e);
  }
};

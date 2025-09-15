import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, Image, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import { getWeatherData, getWeatherTimeStamp, saveWeatherData } from './repositoy/weather-repository';
import Geolocation from 'react-native-geolocation-service';
import Config from './network/config';
import useFetch from './hooks/useFetch';
import { WEATHER_API_KEY } from '@env';
import commonStyles from './styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type WeatherData = {
    location: {
        name: string;
        region: string;
    }
    current: {
        condition: {
            text: string;
            icon: string;
        }
        temp_c: number;
        humidity: number;
        description: string;
        icon: string;
    }
};


const Weather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loadingState, setLoadingState] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [coords, setCoords] = useState<{ lat: number, lon: number } | null>(null);
    const { data, loading, error } = useFetch<WeatherData>({
        url: coords ? `${Config.WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lon}` : null
    });

    const getLocationPermission = useCallback(async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    }, []);



    const fetchWeather = useCallback(async () => {
        console.log('Fetching weather data...');

        const cachedData = await getWeatherData();
        const cachedTime = await getWeatherTimeStamp();
        const now = Date.now();
        console.log('now', now - parseInt(cachedTime), 15 * 60 * 1000);
        console.log(cachedData && cachedTime && ((now - parseInt(cachedTime)) < 15 * 60 * 1000))
        if (cachedData && cachedTime && ((now - parseInt(cachedTime)) < 15 * 60 * 1000)) {
            console.log('Using cached weather data' + JSON.stringify(cachedData));
            setWeather(cachedData);
            setLoadingState(false);
            return;
        }
        const hasPermission = await getLocationPermission();
        console.log('Location permission:', hasPermission);
        if (!hasPermission) {
            setErrorMsg('Location permission denied');
            setLoadingState(false);
            return;
        }


        Geolocation.getCurrentPosition(
            position => {
                console.log('Position:', position);
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lon: longitude });
            }, error => {
                setErrorMsg('Failed to get location');
                setLoadingState(false);
                return;
            }, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 1000,
        });
    }, []);

    const WeatherDisplay = React.memo(({ weather }: { weather: WeatherData }) => (
        <SafeAreaProvider>
            <Text style={styles.place}>{weather.location.name}, {weather.location.region}</Text>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: `https://cdn.weatherapi.com/weather/64x64/night/116.png` }} style={styles.image} />
                <View>
                    <Text style={{ fontSize: 30 }}>{weather?.current?.temp_c}°C</Text>
                    <Text style={{ marginLeft: 10, fontSize: 16 }}>{weather?.current?.condition?.text}</Text>
                </View>
            </View>

            <Text style={{ fontSize: 22, color: 'grey' }}>Humidity</Text>
            <Text style={{ fontSize: 16 }}>{weather?.current?.humidity}%</Text>

        </SafeAreaProvider>
    ));


    useEffect(() => {
        console.log('Initial fetch of weather data...');
        fetchWeather();
        const interval = setInterval(() => {
            console.log('Interval triggered, fetching weather data...');
            fetchWeather();
        }, 15 * 60 * 1000); // every 15 minutes

        return () => clearInterval(interval);
    }, [fetchWeather]);


    useEffect(() => {
        setLoadingState(false);
        if (data) {
            saveWeatherData(data);
            setWeather(data);
            setErrorMsg(null);
            console.log('Weather data saved:', data);
        } else if (error) {
            setErrorMsg(error);
            setLoadingState(false);
        } else if (loading) {
            setLoadingState(true);
        }
    }, [data]);


    return (
        <View style={styles.centeredContent}>
            {errorMsg && <Text style={commonStyles.errorText}>🚨 Error: {errorMsg}</Text>}
            {loadingState && <ActivityIndicator size="large" color="#000000" />}
            {weather && <WeatherDisplay weather={weather} />}
        </View>
    );
}


export default Weather;

const styles = StyleSheet.create({
    image: {
        width: 72,
        height: 72,
    },
    container: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContent: {
        flex: 1,
        flexBasis: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    place: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});
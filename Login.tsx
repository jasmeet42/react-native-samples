import { useEffect, useState } from "react";
import {StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

import {
    useNavigation,
    NavigationProp,
} from '@react-navigation/native';

type RootStackParamList = {
    NewsReader: undefined;
    // add other screens here if needed
};

const Login = () => {
    const [email, setEmail] = useState("eve.holt@reqres.in");
    const [password, setPassword] = useState("cityslicka");
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    // Save JWT securely
    const storeToken = async (token: string) => {
        try {
            await EncryptedStorage.setItem('user_token', token);
            console.log('Token stored securely');
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    };

    // Retrieve JWT
    const getToken = async (): Promise<string | null> => {
        try {
            const token = await EncryptedStorage.getItem('user_token');
            return token;
        } catch (error) {
            console.error('Failed to retrieve token:', error);
            return null;
        }
    };

    // Remove JWT (e.g., on logout)
    const removeToken = async () => {
        try {
            await EncryptedStorage.removeItem('user_token');
            console.log('Token removed');
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    };

    useEffect(() => {
        // Check if token exists on mount
        getToken().then((token: string | null) => {
            if (token) {
                setLoggedIn(true);
                console.log('Existing token found');
            }
        });

    }, []);

    const login = async () => {
        try {
            const response = await axios.post('https://reqres.in/api/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'reqres-free-v1'
                }
            });
            const token = response.data.token;
            console.log('JWT Token:', token);
            ToastAndroid.show('Login Sccessful', ToastAndroid.SHORT);
            setLoggedIn(true);
            storeToken(token)
            navigation.navigate('NewsReader'); // Navigate to NewsReader
        } catch (err) {
            setError('Login failed. Check credentials.');
        }
    };
    const logout = async () => {
        await removeToken();
        setLoggedIn(false);
        ToastAndroid.show('You have been logged out', ToastAndroid.SHORT);
    }

    return (
        <View style={{ flex: 3, padding: 20, flexDirection: 'column' }}>
            {loggedIn ? <TouchableOpacity style={[styles.loginAction]} onPress={logout}>
                <Text style={styles.loginActionText}>
                    LogOut</Text></TouchableOpacity> :
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'stretch', flexDirection: 'column' }}>
                    <TextInput style={styles.username} placeholder="Username" value={email} onChangeText={setEmail} />
                    <TextInput style={styles.username} placeholder="Password" value={password} onChangeText={setPassword} />
                    <TouchableOpacity style={styles.loginAction} onPress={login}><Text style={styles.loginActionText}>Login
                    </Text></TouchableOpacity>
                    {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
                </View>}
        </View>
    );

}

const styles = StyleSheet.create({
    username: {
        borderColor: 'blue', borderWidth: 2, height: 70, borderRadius: 10,
        marginTop: 10
    },
    loginAction: {
        backgroundColor: 'blue', borderRadius: 10, alignItems: 'center', justifyContent: 'center',
        height: 40, marginTop: 20
    },
    loginActionText: {
        color: 'white'
    }
});

export default Login;
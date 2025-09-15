import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewsReader from './NewsReader';
import Login from './Login';
import Weather from './Weather';
import ProductList from './ProdutList';
import ExpenseTracker from './ExpenseTracker';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Login/Logout">
        <Drawer.Screen name="NewsReader" component={NewsReader} />
        <Drawer.Screen name="Login/Logout" component={Login} />
        <Drawer.Screen name="Weather" component={Weather} />
        <Drawer.Screen name="Product List" component={ProductList} />
        <Drawer.Screen name="Expense Tracker" component={ExpenseTracker} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/Home';
import SplashScreen from '../pages/SplashScreen'
import MapScreen from '../pages/MapScreen';
import ReportarInundacion from '../pages/ReportarInundacion';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashHome">
        <Stack.Screen 
          name="SplashHome" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Mapa" 
          component={MapScreen} 
          options={{ title: 'Mapa de Inundaciones',headerShown: false }}


        />

        <Stack.Screen 
          name="ReportarInundacion" 
          component={ReportarInundacion}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>

    </NavigationContainer>
  );
}

import { StatusBar } from 'expo-status-bar';
import { React } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import Routes from './src/routes'

export default function App() {
  return (
   <NavigationContainer>
      <StatusBar backgroundColor='#232630' barStyle="light-content"/>
      <Routes/>
   </NavigationContainer>
  );
}


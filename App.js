import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './firebase';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  // Common header style for Home and Cart screens
  const appHeaderOptions = {
      headerStyle: {
        backgroundColor: '#FAF9F6',
        elevation: 0,
        shadowOpacity: 0, 
      },
      headerTintColor: '#000',
      headerTitle: () => (
          <Text style={{ fontSize: 16, fontWeight: '500' }}>
            {auth.currentUser?.email}
          </Text>
        ),
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={appHeaderOptions} />
            <Stack.Screen name="Cart" component={CartScreen} options={appHeaderOptions}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0',
  },
});
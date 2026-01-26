import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { Image } from 'react-native';
import { StatusBar } from 'react-native';


import HomeScreen from './screens/HomeScreen';
import Transactions from './screens/Transactions';
import CartScreen from './screens/CartScreen';
import PreviewScreen from './screens/PreviewScreen'
import BluetoothScreen from './screens/BluetoothScreen'
import { TransactionProvider } from './screens/TransactionContext'; 
enableScreens();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------- Bottom Tabs ---------- */
function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused }) => {
          let icon;

          if (route.name === 'Home') {
            icon = require('./assets/pricer.png');
          } else if (route.name === 'Transactions') {
            icon = require('./assets/transactions.png');
          }

          return (
            <Image
              source={icon}
              style={{
                width: 24,
                height: 24,
                resizeMode: 'contain',
                tintColor: focused ? '#007AFF' : 'gray',
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={Transactions} />
    </Tab.Navigator>
  );
}

/* ---------- Stack Navigator ---------- */
function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ headerShown:false}}
      />
      <Stack.Screen
      name="PreviewScreen"
      component={PreviewScreen}
      options ={{headerShown:false}}
      
      />
      <Stack.Screen
  name="BluetoothScreen"
  component={BluetoothScreen}
  options={{headerShown:false }}
/>

    </Stack.Navigator>
  );
}

/* ---------- App ---------- */
export default function App() {
  return (
    <TransactionProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
        barStyle="dark-content"
        translucent
        
      />
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
    </TransactionProvider>
  );
}

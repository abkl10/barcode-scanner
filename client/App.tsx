import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckoutScreen from './CheckoutScreen';
import LandingPage from './LandingPage';
import Historique from './HistoriqueScreen';
import Panier from './PanierScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const stripePK = Constants.expoConfig.extra.stripePK;

  return (
    <StripeProvider
      publishableKey={stripePK}
      merchantIdentifier="merchant.com.example"
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="LandingPage" component={LandingPage} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Historique" component={Historique} />
          <Stack.Screen name="Panier" component={Panier} />
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

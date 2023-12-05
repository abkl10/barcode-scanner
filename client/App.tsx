import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckoutScreen from './Views/CheckoutScreen';
import LandingPage from './Views/LandingPage';
import Historique from './Views/HistoriqueScreen';
import Panier from './Views/PanierScreen';
import Scan from './Views/ScanScreen';

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
          <Stack.Screen name="Scan" component={Scan} />

        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

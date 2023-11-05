import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function LandingPage({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Landing Page</Text>
      <Button
        title="Panier"
        onPress={() => navigation.navigate("Panier")}
      />
      <Button
        title="Historique"
        onPress={() => navigation.navigate("Historique")}
      />
      <Button
        title="Checkout"
        onPress={() => navigation.navigate("Checkout")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

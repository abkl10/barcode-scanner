import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import * as SQLITE from "expo-sqlite";
import { initDatabase } from "../db";

const db = SQLITE.openDatabase("bareCode.db");

export default function LandingPage({ navigation }) {
useEffect(() => {
    initDatabase();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Landing Page</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Panier"
          onPress={() => navigation.navigate("Panier")}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Historique"
          onPress={() => navigation.navigate("Historique")}
        />
      </View>
      <View style={styles.buttonContainer}>
            <Button
              title="Scan"
              onPress={() => navigation.navigate("Scan")}
              />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Checkout"
          onPress={() => navigation.navigate("Checkout")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: "80%",
  },
});

import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableHighlight, Image } from "react-native";
import * as SQLITE from "expo-sqlite";
import { initDatabase } from "../db";
import { Fontisto } from '@expo/vector-icons';

const db = SQLITE.openDatabase("bareCode.db");

export default function LandingPage({ navigation }) {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BarCode Scanner Application</Text>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/bar.png')}
          style={styles.image}
        />
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.customButton}
          onPress={() => navigation.navigate("Historique")}
        >
          <React.Fragment>
            <Fontisto name="history" size={24} color="black" />
            <Text style={styles.buttonText}>Historique</Text>
          </React.Fragment>
        </TouchableHighlight>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.customButton}
          onPress={() => navigation.navigate("Scan")}
        >
          <React.Fragment>
            <Fontisto name="barcode" size={24} color="black" />
            <Text style={styles.buttonText}>Scan Item</Text>
          </React.Fragment>
        </TouchableHighlight>
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    margin: 40,
  },
  image: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
    resizeMode: 'contain', // or 'cover' or 'stretch' as needed
  },
  buttonContainer: {
    marginBottom : 15,
    marginTop: 10,
    width: "80%",
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#d4a373',
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    color: 'black',
    fontSize: 18,
  },
});

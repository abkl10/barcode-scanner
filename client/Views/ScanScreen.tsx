import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, View, TextInput, TouchableOpacity } from "react-native";
import { db } from "../db";
import { Fontisto } from '@expo/vector-icons';

export default function Scan({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Enter Article Number");
  const [inputField, setInputField] = useState("");

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  const askCameraPermission = () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  useEffect(() => {
    askCameraPermission();
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Panier",
        [],
        (_, { rows }) => {
          const items = rows._array;
          console.log("Items in panier:", items);
        },
        (error) => {
          console.error("Error selecting items from panier:", error);
        }
      );
    });
  }, []);

  const handleBarCode = ({ type, data }) => {
    setScanned(true);
    setText(data);
    console.log("Type: " + type + "\nData: " + data);
  };

  const checkItem = (itemId) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) as count FROM Panier WHERE itemId = ?",
          [itemId],
          (_, { rows }) => {
            const count = rows.item(0).count;
            resolve(count > 0);
          },
          (error) => {
            console.error("Error checking item existence:", error);
            reject(error);
          }
        );
      });
    });
  };
const checkScan = () => {
  const scannedValue = parseInt(text);

  console.log(scannedValue);

  switch (scannedValue) {
    case 1:
      addItem(1);
      break;
    case 2:
      addItem(2);
      break;
    case 3:
      addItem(3);
      break;
    case 4:
      addItem(4);
      break;
    default:
      break;
  }
};

  const addItem = async (itemId) => {
    try {
      const response = await fetch(`http://192.168.23.122:8080/items/${itemId}`);
      console.log("API Response Status:", response.status);

      if (response.status === 200) {
        const item = await response.json();
        if (item) {
          const AvailableItem = await checkItem(itemId);

          if (AvailableItem) {
            db.transaction((tx) => {
              tx.executeSql(
                "UPDATE Panier SET quantity = quantity + 1 WHERE itemId = ?",
                [itemId],
                (_, result) => {
                  console.log("Quantity updated for", item.name);
                  Alert.alert("Article ajouté au panier");
                },
                (error) => {
                  console.error("Error updating quantity:", error);
                }
              );
            });
          } else {
            db.transaction((tx) => {
              tx.executeSql(
                "INSERT INTO Panier (name, price, itemId, quantity) VALUES (?, ?, ?, ?)",
                [item.name, item.price, itemId, 1],
                (_, { insertId }) => {
                  console.log("Article ajouté au panier avec ID:", insertId);
                  Alert.alert("Article ajouté au panier");
                },
                (error) => {
                  console.error("Error adding item to cart:", error);
                }
              );
            });
          }
        } else {
          Alert.alert("Item not found with id: " + itemId);
        }
      } else {
        Alert.alert("Error", "Item not found or backend offline");
      }
    } catch (error) {
      console.error("Error while adding item to cart:", error);
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askCameraPermission()}
        />
      </View>
    );
origin/main  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
             style={styles.panierButton}
             onPress={() => navigateToScreen("Panier")}
           >
             <Fontisto name="shopping-basket" size={24} color="black" />
           </TouchableOpacity>
            <TouchableOpacity
                        style={styles.homeButton}
                        onPress={() => navigateToScreen("LandingPage")}
                      >
                        <Fontisto name="home" size={24} color="black" />
                      </TouchableOpacity>

      <View style={styles.box}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCode}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.text}>{text}</Text>

      {scanned && (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => {
            checkScan();
          }}
        >
          <Text style={styles.addToCartButtonText}>Ajouter au Panier</Text>
        </TouchableOpacity>
      )}
       <View style={styles.inputContainer}>
              <TextInput
                style={styles.articleNumber}
                placeholder="Article number"
                keyboardType="numeric"
                onChangeText={(text) => setInputField(text)}
              />
            </View>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => {
          addItem(parseInt(inputField));
        }}
      >
        <Text style={styles.addToCartButtonText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginTop: 25,
  },
  box: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 30,
    marginTop : 50,
  },
   inputContainer: {
      width: "50%",
      marginBottom: 20,
    },
    articleNumber: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 10,
      marginTop : 30,
    },
  panierButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "khaki",
    padding: 10,
    borderRadius: 5,
  },
  homeButton : {
      position: "absolute",
      top: 20,
      left: 20,
      backgroundColor: "khaki",
      padding: 10,
      borderRadius: 5,
  },
  addToCartButton: {
    backgroundColor: "#ccd5ae",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addToCartButtonText: {
    color: "white",
    fontWeight: "bold",
  },
};
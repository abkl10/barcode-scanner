import { Camera } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, Text, Button, SafeAreaView, View, TextInput } from "react-native";
import { db } from "../db";

export default function Scan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Not yet scanned");

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

  const addItem = async (itemId) => {
    try {
      const response = await fetch(`http://192.168.23.216:8080/items/${itemId}`);
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCode}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.text}>{text}</Text>

      {scanned && (
        <Button
          title={"Ajouter au Panier"}
          onPress={() => {
            addItem(1);
          }}
          color="tomato"
        />
      )}
      <TextInput
        style={styles.articleNumber}
        placeholder="Article number"
        keyboardType="numeric"
        value="1"
      />
      <Button
        title="Add to cart"
        onPress={() => {
          addItem(1);
        }}
      />
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
  },
  articleNumber: {
  marginLeft:5,
  },
};

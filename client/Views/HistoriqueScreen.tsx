import React from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { db } from "../db";
import { useFocusEffect } from "@react-navigation/native";

const Achetée = ({ item }) => (
  <View style={styles.Achetee}>
    <View style={styles.statusButton}>
      <AntDesign name="pushpin" size={24} />
    </View>
    <View style={styles.purchaseDetails}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
    <TouchableOpacity style={styles.price}>
      <Text style={styles.priceText}>€{item.price}</Text>
    </TouchableOpacity>
  </View>
);

export default function Historique() {
  const [purchaseHistory, setPurchaseHistory] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT * FROM Achats ORDER BY purchaseDate DESC",
            [],
            (_, { rows }) => {
              const historyData = rows._array.map((item) => ({
                ...item,
              }));
              setPurchaseHistory(historyData);
            },
            (error) => {
              console.error("Problème rencontré lors de récupération des achats:", error);
            }
          );
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    }, [])
  );

  const clearHistory = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM Achats",
          [],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              // Clear successful
              setPurchaseHistory([]);
            } else {
              console.warn("No records to delete.");
            }
          },
          (error) => {
            console.error("Error clearing purchase history:", error);
          }
        );
      },
      (error) => {
        console.error("Transaction error:", error);
      }
    );
  };

  // Item separator component
  const renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      {purchaseHistory.length === 0 ? (
        <Text>No purchase history available.</Text>
      ) : (
        <>
          <FlatList
            data={purchaseHistory}
            renderItem={({ item }) => <Achetée item={item} />}
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={renderSeparator} // Add this line for the separator
          />
          <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
                      <Text style={styles.clearButtonText}> Home</Text>
           </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF",
  },
  Achetee: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseDetails: {
    flex: 1,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 16,
    color: "white",
    backgroundColor: "black",
  },
  text: {
    fontSize: 12,
  },
  price: {
    backgroundColor: "green",
    width: 50,
    alignItems: "center",
    borderRadius: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  clearButton: {
    backgroundColor: "#d4a373",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "black",
    marginVertical: 5, // Adjust the margin as needed
  },
});

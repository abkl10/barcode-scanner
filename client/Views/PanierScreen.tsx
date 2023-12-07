import React, { useState, useEffect } from "react";
import { Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../db";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import CheckoutScreen from "./CheckoutScreen";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const stripePK = Constants.expoConfig.extra.stripePK;
type Item = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function PanierItem({
  item,
  updateQuantityMinus,
  updateQuantityPlus,
}: {
  item: Item;
  updateQuantityMinus: (itemId: number, itemPrice: number) => void;
  updateQuantityPlus: (itemId: number, itemPrice: number) => void;
}) {
  const { containerStyle, textStyle, items, Prix, itemStyle } =
    styles;

  return (
    <View style={containerStyle}>


      <View style={items}>
        <Icon.Button
          name="ios-remove"
          size={15}
          color="#fff"
          backgroundColor="rgba(255, 255, 255, 0)"
          style={{
            borderRadius: 15,
            backgroundColor: "red",
            height: 30,
            width: 30,
          }}
          iconStyle={{ marginRight: 0 }}
          onPress={() => {
            updateQuantityMinus(item.id, item.price);
          }}
        />

      <View style={textStyle}>
      <View style={itemStyle}>
        <Text >{item.name}  :   {item.quantity}</Text>
        <View style={Prix}>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        </View>
      </View>
        <Icon.Button
          name="ios-add"
          size={15}
          backgroundColor="rgba(255, 255, 255, 0)"
          style={{
            color: styles.darkText,
            borderRadius: 15,
            backgroundColor: "green",
            height: 30,
            width: 30,
          }}
          iconStyle={{ marginRight: 0 }}
          onPress={() => {
            updateQuantityPlus(item.id, item.price);
          }}
        />
      </View>
    </View>
  );
}

export default function Panier() {
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  const [checkoutTotalJson, setCheckoutTotalJson] = useState<any[]>([
    { id: 1, amount: 100 },
  ]);

  useEffect(() => {
    if (checkoutTotalJson.length > 0) {
      setShowCheckout(true);
    }
  }, [checkoutTotalJson]);

  useEffect(() => {
    setShowCheckout(false);
    const newCheckoutTotalJson = cartItems.map((item) => ({
      id: item.itemId,
      amount: item.quantity * 100,
    }));

    setCheckoutTotalJson(newCheckoutTotalJson);
  }, [cartItems]);

  useFocusEffect(
    React.useCallback(() => {
      db.transaction(
        (tx) => {
          try {
            tx.executeSql("SELECT * FROM Panier", [], (_, { rows }) => {
              const cartData = rows._array;
              setCartItems(cartData);
              console.log("Data Fetched Successfully", cartItems);
              const initialTotal = cartData.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );
              setTotal(initialTotal);
            });
          } catch (error) {
            console.error("Error while executing SQL:", error);
          }
        },
        (error) => {
          console.error("Transaction error:", error);
        }
      );
    }, [])
  );

 const Vider = () => {
    db.transaction(
      (tx) => {
        // Drop the existing panier table
        tx.executeSql(
          "DROP TABLE IF EXISTS Panier",
          [],
          () => {
            console.log("Cart table dropped.");

            tx.executeSql(
              "CREATE TABLE IF NOT EXISTS Panier (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, itemId INTEGER, quantity INTEGER)",
              [],
              () => {
                console.log("Cart table recreated.");

                setCartItems([]);
              },
              (error) => {
                console.error("Error recreating cart table:", error);
              }
            );
          },
          (error) => {
            console.error("Error dropping cart table:", error);
          }
        );
      },
      (error) => {
        console.error("Transaction Error", error);
      }
    );
  };


  const updateQuantityMinus = (itemId: number, itemPrice: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Panier SET quantity = quantity - 1 WHERE itemId = ?",
        [itemId],
        (_, result) => {
          const updatedItems = cartItems.map((item) => {
            if (item.itemId === itemId) {
              if (item.quantity - 1 === 0) {
                tx.executeSql(
                  "DELETE FROM Panier WHERE itemId = ?",
                  [itemId],
                  () => {
                    console.log("Item removed from the database.");
                  },
                  (error) => {
                    console.error(
                      "Error removing item from the database:",
                      error
                    );
                  }
                );
              }
              return {
                ...item,
                quantity: item.quantity - 1,
              };
            }
            return item;
          });
          setTotal(total - itemPrice); // Update the total price
          setCartItems(updatedItems);
        },
        (error) => {
          console.error("Error decreasing quantity:", error);
        }
      );
    });
  };

  const updateQuantityPlus = (itemId: number, itemPrice: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Panier SET quantity = quantity + 1 WHERE itemId = ?",
        [itemId],
        (_, result) => {
          // Update the local state with the updated cart items
          const updatedItems = cartItems.map((item) => {
            if (item.itemId === itemId) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
            return item;
          });
          setCartItems(updatedItems);
          setTotal(total + itemPrice); // Update the total price
        },
        (error) => {
          console.error("Error increasing quantity:", error);
        }
      );
    });
  };

  return (
    <>
      {cartItems.length <= 0 ? (
        <View style={styles.ItemEx}>
          <AntDesign name="exclamationcircle" size={35} color="gray" />
          <Text style={styles.NoItem}>No Item Added </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            <FlatList
              data={cartItems}
              renderItem={({ item, index }) => (
                <PanierItem
                  item={item}
                  index={index}
                  updateQuantityMinus={updateQuantityMinus}
                  updateQuantityPlus={updateQuantityPlus}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          <View >
            <View style={styles.sum}>
              <MaterialCommunityIcons name="cart-variant" size={24} color="black" />
                <Text>${total}</Text>
            </View>
            <View style={styles.check}>
              <View style={styles.checkoutButtonStyle}>
                {!showCheckout ? (
                  <Text>none</Text>
                ) : (
                  <StripeProvider
                    publishableKey={stripePK}
                    merchantIdentifier="merchant.com.example"
                  >
                    <CheckoutScreen
                      items={checkoutTotalJson}
                      total={total}
                      Vider={Vider}
                    />
                  </StripeProvider>
                )}
              </View>
              {cartItems.length > 0 && (
                 <TouchableOpacity
                       style={styles.clearCartButton}
                       onPress={() => Vider()}
                     >
                       <Text>Clear Cart</Text>
                     </TouchableOpacity>
                )}
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = {
  container: {
    flex: 0.91,
  },
  itemContainer: {
    flex: 10,
  },
  itemStyle : {
  alignItems : "center",
  },
  containerStyle: {
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "white",
    padding: 10,
    paddingLeft: 15,
    backgroundColor: "#fefae0",
  },
   clearCartButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#e74c3c",
      padding: 10,
      borderRadius: 5,
      marginTop: 15,
    },
  NoItem: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 50,
    color: "gray",
  },
  ItemEx: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    color: "gray",
  },
  lastItemStyle: {
    flexDirection: "row",
    flex: 1,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: "#fff",
  },
  textStyle: {
    flex: 2,
    justifyContent: "center",
  },
  price: {
    color: "white",
    fontSize: 13,
  },
  Prix: {
    backgroundColor: "#d4a373",
    width: 40,
    alignItems: "center",
    marginTop: 3,
    borderRadius: 3,
  },
  items: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  checkoutButtonStyle: {
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#ccd5ae",
    padding: 10,
    borderRadius: 5,
    marginTop:10
  },
  sum: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15,
  },
};

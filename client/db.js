import { openDatabase } from "expo-sqlite";

const db = openDatabase("barCode.db");

const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Panier (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, itemId INTEGER, quantity INTEGER)",
      [],
      () => {
        console.log('Table "Panier" created successfully.');
      },
      (error) => {
        console.error('Error creating the "Panier" table:', error);
      }
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS Achats (id INTEGER PRIMARY KEY AUTOINCREMENT, purchaseDate TEXT, price REAL)",
      [],
      () => {
        console.log('Table "Achats" created successfully.');
      },
      (error) => {
        console.error('Error creating the "Achats" table:', error);
      }
    );
  });
  /*
  tx.executeSql(
        "DROP TABLE IF EXISTS Panier",
        [],
        () => {
          console.log('Table "Panier" dropped successfully.');
        },
        (error) => {
          console.error('Error dropping the "Panier" table:', error);
        }
      );
      tx.executeSql(
        "DROP TABLE IF EXISTS Achats",
        [],
        () => {
          console.log('Table "Achats" dropped successfully.');
        },
        (error) => {
          console.error('Error dropping the "Achats" table:', error);
        }
      );
      // Commit the transaction
      tx.executeSql("COMMIT;");
    });
  */
};

export { db, initDatabase };

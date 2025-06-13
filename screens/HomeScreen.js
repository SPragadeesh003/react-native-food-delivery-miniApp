import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const foodImages = {
      'Burger': require('../assets/burger image.jpeg'),
      'pizza': require('../assets/pizza.jpeg'),
      'Pasta': require('../assets/pasta.jpeg'),
      'Salad': require('../assets/salad.jpeg'),
  };
  const defaultImage = require('../assets/default-food.jpeg');
  
  useEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity 
                onPress={() => {
                    Alert.alert(
                        "Logout",
                        "Are you sure you want to log out?",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            { 
                                text: "Logout", 
                                onPress: () => auth.signOut(),
                                style: 'destructive'
                            }
                        ]
                    );
                }} 
                style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 24 }}>☰</Text>
            </TouchableOpacity>
        ),
        headerLeft: null, 
      });
    const fetchFoodItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFoodItems(items);
      } catch (error) {
        console.error("Error fetching food items: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFoodItems();
  }, [navigation]);

  const handleAddToCart = async (item) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const cartItemRef = doc(db, 'carts', userId, 'items', item.id);
    try {
      const docSnap = await getDoc(cartItemRef);
      if (docSnap.exists()) {
        // If item exists, increment the quantity
        await updateDoc(cartItemRef, {
            quantity: increment(1)
        });
        Alert.alert('Success', 'Quantity updated in cart!');
      } else {
        // If item doesn't exist, add it to the cart
        await setDoc(cartItemRef, { 
            name: item.name, 
            price: item.price, 
            description: item.description, 
            quantity: 1 
        });
        Alert.alert('Success', `${item.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart: ", error);
      Alert.alert('Error', 'Could not update cart.');
    }
  };

  const renderFoodItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={foodImages[item.name] || defaultImage} style={styles.itemImage} />
      <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.pageHeader}>
            <View style={{flex: 1}}>
                <Text style={styles.pageTitle}>Home</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
                <Text style={{ fontSize: 28 }}>🛒</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.pageSubtitle}>Food Items</Text>
        <View style={styles.listContainer}>
            {loading ? <ActivityIndicator size="large" color="#FF6347" /> : <FlatList data={foodItems} renderItem={renderFoodItem} keyExtractor={item => item.id} contentContainerStyle={styles.list} />}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' }, 
  pageHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  pageTitle: {
      fontSize: 34,
      fontWeight: 'bold'
  },
  pageSubtitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 10
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center', 
  },
  list: { 
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  itemContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0EFEA'},
  itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#000'},
  itemDescription: { fontSize: 14, color: '#666', marginTop: 2 },
  priceContainer: {
    alignItems: 'center',
  },
  itemPrice: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#000',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#FF6347',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

export default HomeScreen;
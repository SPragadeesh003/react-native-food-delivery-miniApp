import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { collection, getDocs, writeBatch, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const foodImages = {
      'Burger': require('../assets/burger image.jpeg'),
      'pizza': require('../assets/pizza.jpeg'),
      'Pasta': require('../assets/pasta.jpeg'),
      'Salad': require('../assets/salad.jpeg'),
  };
  const defaultImage = require('../assets/default-food.jpeg');

  const fetchCartItems = async () => {
    setLoading(true);
    if (!auth.currentUser) { setLoading(false); return; }
    const userId = auth.currentUser.uid;
    try {
      const querySnapshot = await getDocs(collection(db, 'carts', userId, 'items'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
      const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setTotal(calculatedTotal);
    } catch (error) {
      console.error("Error fetching cart items: ", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(React.useCallback(() => { fetchCartItems(); }, []));

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const cartItemRef = doc(db, 'carts', userId, 'items', item.id);

    if (newQuantity > 0) {
      // Update the quantity
      await updateDoc(cartItemRef, { quantity: newQuantity });
    } else {
      // Remove the item if quantity is 0
      await deleteDoc(cartItemRef);
    }
    // Refresh the cart from Firestore
    fetchCartItems();
  };

  const handlePlaceOrder = async () => {
    if (!auth.currentUser || cartItems.length === 0) return;
    const userId = auth.currentUser.uid;
    const batch = writeBatch(db);
    cartItems.forEach(item => { batch.delete(doc(db, 'carts', userId, 'items', item.id)); });
    try {
      await batch.commit();
      Alert.alert('Success', 'Order placed successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error("Error placing order: ", error);
    }
  };
  
  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
        <Image source={foodImages[item.name] || defaultImage} style={styles.itemImage} />
        <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            {/* Display total price for the item row */}
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text> 
        </View>
        <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(item, item.quantity - 1)}>
                <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => handleUpdateQuantity(item, item.quantity + 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Cart</Text>
      </View>
      <View style={styles.listContainer}>
          {loading ? <ActivityIndicator size="large" color="#FF6347" /> : cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty.</Text>
            </View>
          ) : (
            <FlatList data={cartItems} renderItem={renderCartItem} keyExtractor={item => item.id} contentContainerStyle={styles.list}/>
          )}
      </View>
      {cartItems.length > 0 && !loading && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalAmount}>₹{total}</Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
            <Text style={styles.orderButtonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  pageHeader: { paddingHorizontal: 20, marginTop: 10, marginBottom: 10 },
  pageTitle: { fontSize: 34, fontWeight: 'bold' },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  list: { 
    paddingHorizontal: 20,
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { fontSize: 18, color: '#666' },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 15 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  itemPrice: { fontSize: 16, color: '#666', marginTop: 4 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  quantityButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  footer: { borderTopWidth: 1, borderTopColor: '#F0EFEA', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, backgroundColor: '#FAF9F6' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  totalText: { fontSize: 18, color: '#666', fontWeight: '500'},
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  orderButton: { backgroundColor: '#FF6347', borderRadius: 10, padding: 18, alignItems: 'center' },
  orderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;
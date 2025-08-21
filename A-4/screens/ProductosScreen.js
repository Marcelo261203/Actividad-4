import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProductCard from '../components/ProductCard';
import { productosService } from '../services/firebaseService';
import { useCart } from '../context/CartContext';

const ProductosScreen = () => {
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { itemCount, items } = useCart();

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productosService.getProductos();
      setProductos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
      console.error('Error loading productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProductos();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProductos();
  }, []);

  // Recargar productos cuando se regrese a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProductos();
    });

    return unsubscribe;
  }, [navigation]);

  // Forzar re-render cuando cambie el carrito
  useEffect(() => {
    // Este efecto se ejecuta cada vez que cambia itemCount o items
    console.log('🔄 ProductosScreen: Carrito actualizado', { itemCount, itemsCount: items.length });
  }, [itemCount, items]);

  const renderProducto = ({ item }) => (
    <ProductCard producto={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Productos Disponibles</Text>
        <Text style={styles.subtitle}>
          {productos.length} productos encontrados
        </Text>
        {itemCount > 0 && (
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              🛒 {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en el carrito
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2196F3']}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  cartInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  cartText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 8,
  },
});

export default ProductosScreen;

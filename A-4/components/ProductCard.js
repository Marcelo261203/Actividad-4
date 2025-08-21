import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ producto }) => {
  const { addItem, removeItem, updateQuantity, items } = useCart();
  
  // Calcular stock disponible (stock original - cantidad en carrito)
  const cantidadEnCarrito = items.find(item => item.id === producto.id)?.cantidad || 0;
  const stockDisponible = Math.max(0, producto.stock - cantidadEnCarrito);

  const handleAddToCart = () => {
    if (stockDisponible > 0) {
      addItem(producto);
      Alert.alert('✅ Éxito', `${producto.nombre} agregado al carrito\nStock restante: ${stockDisponible - 1}`);
    } else {
      Alert.alert('❌ Error', 'Producto sin stock disponible');
    }
  };

  const handleAddMore = () => {
    if (stockDisponible > 0) {
      addItem(producto);
      Alert.alert('✅ Agregado', `${producto.nombre} agregado al carrito\nStock restante: ${stockDisponible - 1}`);
    } else {
      Alert.alert('❌ Error', 'No hay más stock disponible');
    }
  };

  const handleRemoveFromCart = () => {
    const itemInCart = items.find(item => item.id === producto.id);
    if (itemInCart) {
      removeItem(producto.id);
      Alert.alert('🗑️ Eliminado', `${producto.nombre} eliminado del carrito`);
    } else {
      Alert.alert('❌ Error', 'Este producto no está en el carrito');
    }
  };

  const handleSubtractFromCart = () => {
    const itemInCart = items.find(item => item.id === producto.id);
    if (itemInCart && itemInCart.cantidad > 1) {
      // Si hay más de 1 unidad, reducir en 1
      const nuevaCantidad = itemInCart.cantidad - 1;
      updateQuantity(producto.id, nuevaCantidad);
      Alert.alert('➖ Reducido', `${producto.nombre} reducido a ${nuevaCantidad} unidad(es)`);
    } else if (itemInCart && itemInCart.cantidad === 1) {
      // Si solo hay 1 unidad, eliminar completamente
      removeItem(producto.id);
      Alert.alert('🗑️ Eliminado', `${producto.nombre} eliminado del carrito`);
    } else {
      Alert.alert('❌ Error', 'Este producto no está en el carrito');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: producto.imagen || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: 'https://via.placeholder.com/400x300/f0f0f0/cccccc?text=Cargando...' }}
        />
        {stockDisponible === 0 && (
          <View style={styles.outOfStock}>
            <Text style={styles.outOfStockText}>Sin Stock</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {producto.nombre}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {producto.descripcion}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.price}>
            ${producto.precio.toFixed(2)}
          </Text>
          
          <View style={styles.stockContainer}>
            <Text style={[
              styles.stock,
              stockDisponible <= 3 && stockDisponible > 0 && styles.stockLow,
              stockDisponible === 0 && styles.stockOut
            ]}>
              Stock: {stockDisponible}
              {stockDisponible <= 3 && stockDisponible > 0 && ' ⚠️'}
              {stockDisponible === 0 && ' ❌'}
            </Text>
            {cantidadEnCarrito > 0 && (
              <View style={styles.cartIndicator}>
                <Text style={styles.cartIndicatorText}>
                  🛒 {cantidadEnCarrito} en carrito
                </Text>
                <Text style={styles.cartIndicatorSubtext}>
                  Total: ${(producto.precio * cantidadEnCarrito).toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          {cantidadEnCarrito === 0 ? (
            <TouchableOpacity
              style={[
                styles.addButton,
                stockDisponible === 0 && styles.addButtonDisabled
              ]}
              onPress={handleAddToCart}
              disabled={stockDisponible === 0}
            >
              <Text style={styles.addButtonText}>
                {stockDisponible === 0 ? 'Sin Stock' : 'Agregar'}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={handleAddMore}
                disabled={stockDisponible === 0}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subtractButton}
                onPress={handleSubtractFromCart}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={handleRemoveFromCart}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  outOfStock: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  outOfStockText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  stockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stock: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cartIndicator: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cartIndicatorText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  cartIndicatorSubtext: {
    fontSize: 10,
    color: '#1976d2',
    fontStyle: 'italic',
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addMoreButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  subtractButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#FF9800',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#f44336',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para indicadores de stock
  stockLow: {
    color: '#f57c00',
    backgroundColor: '#fff3e0',
    fontWeight: 'bold',
  },
  stockOut: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    fontWeight: 'bold',
  },
});

export default ProductCard;

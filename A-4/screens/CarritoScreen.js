import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { useCart } from '../context/CartContext';
import { pedidosService, productosService } from '../services/firebaseService';
import { testCrearPedidoSimple } from '../utils/testPedidoSimple';
import { Ionicons } from '@expo/vector-icons';

const CarritoScreen = ({ navigation }) => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const [verificandoStock, setVerificandoStock] = useState(false);
  const [problemasStock, setProblemasStock] = useState([]);

  const handleQuantityChange = (productoId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productoId);
    } else {
      updateQuantity(productoId, newQuantity);
    }
  };

  // Verificar stock en tiempo real
  const verificarStockEnTiempoReal = async () => {
    if (items.length === 0) {
      setProblemasStock([]);
      return;
    }

    try {
      setVerificandoStock(true);
      const verificaciones = await productosService.verificarStockMultiple(items);
      const problemas = verificaciones.filter(v => !v.stockSuficiente);
      setProblemasStock(problemas);
      
      if (problemas.length > 0) {
        console.log('⚠️ Problemas de stock detectados:', problemas);
      }
    } catch (error) {
      console.error('Error al verificar stock en tiempo real:', error);
    } finally {
      setVerificandoStock(false);
    }
  };

  // Verificar stock cuando cambien los items del carrito
  useEffect(() => {
    verificarStockEnTiempoReal();
  }, [items]);

  const handleCheckout = async () => {
    console.log('🚀 handleCheckout iniciado');
    console.log('📊 Estado actual:', { items: items.length, total });
    
    if (items.length === 0) {
      console.log('❌ Carrito vacío');
      Alert.alert('Carrito vacío', 'Agrega productos antes de realizar el pedido');
      return;
    }

    // Mostrar confirmación antes de proceder
    Alert.alert(
      'Confirmar Pedido',
      `¿Estás seguro de que quieres realizar este pedido por $${total.toFixed(2)}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: async () => {
            await procesarPedido();
          },
        },
      ]
    );
  };

  const procesarPedido = async () => {
    try {
      console.log('🛒 Procesando pedido...');
      console.log('📦 Items en carrito:', items);
      console.log('💰 Total del carrito:', total);

      if (!items || items.length === 0) {
        console.log('❌ No hay items en el carrito');
        Alert.alert('Error', 'No hay productos en el carrito');
        return;
      }

      // Crear el pedido
      const pedido = {
        productos: items.map(item => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad
        })),
        total: total,
        cantidadTotal: items.reduce((sum, item) => sum + item.cantidad, 0),
        fecha: new Date(),
        estado: 'pendiente'
      };

      console.log('📋 Pedido a crear:', JSON.stringify(pedido, null, 2));
      
      // Usar la función original que sabemos que funciona
      const pedidoId = await pedidosService.crearPedido(pedido);
      
      console.log('✅ Pedido procesado exitosamente:', pedidoId);
      
      // Actualizar stock de los productos
      console.log('🔄 Actualizando stock...');
      const actualizacionesStock = await productosService.actualizarStockMultiple(pedido.productos);
      console.log('✅ Stock actualizado:', actualizacionesStock);

      // Limpiar carrito
      clearCart();
      console.log('🧹 Carrito limpiado');

      // Crear mensaje con resumen de actualizaciones de stock
      const resumenStock = actualizacionesStock.map(update => 
        `${update.nombre}: ${update.cantidadVendida} unidades`
      ).join('\n');

      Alert.alert(
        '🎉 Pedido Exitoso',
        `Tu pedido #${pedidoId.slice(-8)} ha sido realizado correctamente.\n\nStock actualizado:\n${resumenStock}`,
        [
          {
            text: 'Ver Pedidos',
            onPress: () => navigation.navigate('Pedidos'),
          },
          {
            text: 'Continuar Comprando',
            onPress: () => {
              // Navegar a productos para que se actualice el stock en la interfaz
              navigation.navigate('Productos');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error al procesar pedido:', error);
      console.error('❌ Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Mostrar error específico al usuario
      Alert.alert(
        '❌ Error al crear pedido', 
        `Detalles del error:\n${error.message}\n\nCódigo: ${error.code || 'N/A'}\n\nPor favor, intenta nuevamente.`,
        [
          {
            text: 'OK',
            style: 'cancel',
          },
          {
            text: 'Ver Logs',
            onPress: () => {
              console.log('🔍 Logs completos del error:', error);
            },
          },
        ]
      );
    }
  };

  const probarPedidoSimple = async () => {
    try {
      console.log('🧪 Probando pedido simple...');
      
      const resultado = await testCrearPedidoSimple(items, total);
      
      if (resultado.success) {
        console.log('✅ Prueba simple exitosa:', resultado.pedidoId);
        
        // Limpiar carrito después de crear el pedido
        clearCart();
        console.log('🧹 Carrito limpiado después de prueba exitosa');
        
        // Crear mensaje con resumen de actualizaciones de stock
        const resumenStock = resultado.actualizacionesStock ? 
          resultado.actualizacionesStock.map(update => 
            `${update.nombre}: ${update.cantidadVendida} unidades`
          ).join('\n') : 'No se actualizó stock';
        
        Alert.alert(
          '✅ Prueba Exitosa',
          `Pedido de prueba creado: #${resultado.pedidoId.slice(-8)}\n\nCarrito limpiado automáticamente.\n\nStock actualizado:\n${resumenStock}`,
          [
            {
              text: 'Ver Pedidos',
              onPress: () => navigation.navigate('Pedidos'),
            },
            {
              text: 'Continuar Comprando',
              onPress: () => {
                // Navegar a productos para que se actualice el stock en la interfaz
                navigation.navigate('Productos');
              },
            },
          ]
        );
      } else {
        console.log('❌ Prueba simple falló:', resultado.error);
        Alert.alert(
          '❌ Prueba Falló',
          `Error: ${resultado.error}`,
          [
            {
              text: 'OK',
            },
          ]
        );
      }
    } catch (error) {
      console.error('❌ Error en prueba simple:', error);
      Alert.alert('❌ Error', `Error: ${error.message}`);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.nombre}
        </Text>
        <Text style={styles.itemPrice}>
          ${item.precio.toFixed(2)} c/u
        </Text>
        <Text style={styles.itemSubtotal}>
          Subtotal: ${(item.precio * item.cantidad).toFixed(2)}
        </Text>
        <Text style={styles.itemCalculation}>
          {item.cantidad} × ${item.precio.toFixed(2)} = ${(item.precio * item.cantidad).toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.cantidad - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.cantidad}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.cantidad + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            console.log('🗑️ Botón eliminar presionado para:', item.nombre);
            console.log('🗑️ ID del producto:', item.id);
            console.log('🗑️ Ejecutando removeItem directamente...');
            removeItem(item.id);
            console.log('🗑️ removeItem ejecutado');
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>
          Agrega productos para comenzar a comprar
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Productos')}
        >
          <Text style={styles.browseButtonText}>Ver Productos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrito de Compras</Text>
        <Text style={styles.itemCount}>
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            console.log('🧪 Botón de prueba presionado');
            console.log('📦 Items actuales:', items);
            console.log('💰 Total actual:', total);
          }}
        >
          <Text style={styles.testButtonText}>🧪 Test</Text>
        </TouchableOpacity>
      </View>

      {/* Advertencias de stock */}
      {verificandoStock && (
        <View style={styles.stockWarningContainer}>
          <Text style={styles.stockWarningText}>🔄 Verificando stock en tiempo real...</Text>
        </View>
      )}

      {problemasStock.length > 0 && (
        <View style={styles.stockErrorContainer}>
          <Text style={styles.stockErrorTitle}>⚠️ Problemas de Stock Detectados</Text>
          {problemasStock.map((problema, index) => (
            <Text key={index} style={styles.stockErrorText}>
              • {problema.nombre}: solicitado {problema.cantidadSolicitada}, disponible {problema.stockActual}
            </Text>
          ))}
          <Text style={styles.stockErrorSubtitle}>
            Actualiza tu carrito o contacta al administrador.
          </Text>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <View>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalItems}>
              {items.reduce((sum, item) => sum + item.cantidad, 0)} {items.reduce((sum, item) => sum + item.cantidad, 0) === 1 ? 'producto' : 'productos'}
            </Text>
          </View>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              console.log('🧹 Botón Vaciar Carrito presionado');
              console.log('🧹 Ejecutando clearCart directamente...');
              clearCart();
              console.log('🧹 Carrito limpiado');
            }}
          >
            <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              console.log('🛒 Botón Realizar Pedido presionado');
              console.log('📦 Items en carrito:', items);
              console.log('💰 Total:', total);
              handleCheckout();
            }}
          >
            <Text style={styles.checkoutButtonText}>Realizar Pedido</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testButtonContainer}>
          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: '#ff9800' }]}
            onPress={() => {
              console.log('🧪 Botón de prueba presionado');
              procesarPedido();
            }}
          >
            <Text style={styles.checkoutButtonText}>🧪 Probar Pedido Directo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.checkoutButton, { backgroundColor: '#9c27b0', marginTop: 8 }]}
            onPress={() => {
              console.log('🧪 Botón de prueba simple presionado');
              probarPedidoSimple();
            }}
          >
            <Text style={styles.checkoutButtonText}>🧪 Prueba Simple</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 8,
  },
  cartItem: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  itemCalculation: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalItems: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  testButtonContainer: {
    marginTop: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para advertencias de stock
  stockWarningContainer: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  stockWarningText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  stockErrorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  stockErrorTitle: {
    color: '#721c24',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stockErrorText: {
    color: '#721c24',
    fontSize: 14,
    marginBottom: 4,
  },
  stockErrorSubtitle: {
    color: '#721c24',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default CarritoScreen;

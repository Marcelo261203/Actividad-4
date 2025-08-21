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
import { pedidosService } from '../services/firebaseService';

const PedidosScreen = () => {
  const navigation = useNavigation();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      const data = await pedidosService.getPedidos();
      console.log('📋 Pedidos cargados:', data.length);
      setPedidos(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los pedidos');
      console.error('Error loading pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPedidos();
    setRefreshing(false);
  };

  useEffect(() => {
    loadPedidos();
  }, []);

  // Recargar pedidos cuando se regrese a esta pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPedidos();
    });

    return unsubscribe;
  }, [navigation]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return '#FF9800';
      case 'en_proceso':
        return '#2196F3';
      case 'completado':
        return '#4CAF50';
      case 'cancelado':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'completado':
        return 'Completado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPedido = ({ item }) => (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>Pedido #{item.id.slice(-8)}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{getEstadoText(item.estado)}</Text>
        </View>
      </View>

      <Text style={styles.fechaText}>{formatDate(item.fecha)}</Text>

      <View style={styles.productosContainer}>
        <Text style={styles.productosTitle}>Productos:</Text>
        {item.productos.map((producto, index) => (
          <View key={index} style={styles.productoItem}>
            <Text style={styles.productoNombre}>
              {producto.nombre} x{producto.cantidad}
            </Text>
            <Text style={styles.productoSubtotal}>
              ${producto.subtotal.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.pedidoFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${item.total.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.cantidadTotal}>
          {item.cantidadTotal} {item.cantidadTotal === 1 ? 'producto' : 'productos'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Pedidos</Text>
        <Text style={styles.subtitle}>
          {pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} realizados
        </Text>
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No hay pedidos</Text>
          <Text style={styles.emptySubtitle}>
            Realiza tu primer pedido para verlo aquí
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderPedido}
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
      )}
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
  },
  listContainer: {
    paddingVertical: 8,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fechaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  productosContainer: {
    marginBottom: 12,
  },
  productosTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productoNombre: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  productoSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  pedidoFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cantidadTotal: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default PedidosScreen;

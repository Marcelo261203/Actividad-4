import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';

import ProductosScreen from '../screens/ProductosScreen';
import CarritoScreen from '../screens/CarritoScreen';
import PedidosScreen from '../screens/PedidosScreen';

const Tab = createBottomTabNavigator();

// Componente para mostrar el badge del carrito
const CartBadge = ({ itemCount }) => {
  if (itemCount === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{itemCount}</Text>
    </View>
  );
};

const AppNavigator = () => {
  const { itemCount } = useCart();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Productos') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Carrito') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'Pedidos') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return (
              <View style={styles.iconContainer}>
                <Ionicons name={iconName} size={size} color={color} />
                {route.name === 'Carrito' && <CartBadge itemCount={itemCount} />}
              </View>
            );
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Productos" 
          component={ProductosScreen}
          options={{
            title: 'Productos',
            headerTitle: 'Catálogo de Productos',
          }}
        />
        <Tab.Screen 
          name="Carrito" 
          component={CarritoScreen}
          options={{
            title: 'Carrito',
            headerTitle: 'Carrito de Compras',
          }}
        />
        <Tab.Screen 
          name="Pedidos" 
          component={PedidosScreen}
          options={{
            title: 'Pedidos',
            headerTitle: 'Historial de Pedidos',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default AppNavigator;

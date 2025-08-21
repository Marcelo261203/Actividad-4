import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial del carrito
const initialState = {
  items: []
};

// Tipos de acciones
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// Reducer del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      console.log('🔄 ADD_ITEM reducer ejecutado con payload:', action.payload.nombre);
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        console.log('🔄 Producto existente, incrementando cantidad de', existingItem.cantidad, 'a', existingItem.cantidad + 1);
        const newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          )
        };
        console.log('🔄 Nuevo estado después de ADD_ITEM:', { items: newState.items.length, itemCount: newState.items.reduce((sum, item) => sum + item.cantidad, 0) });
        return newState;
      } else {
        console.log('🔄 Producto nuevo, agregando con cantidad 1');
        const newState = {
          ...state,
          items: [...state.items, { ...action.payload, cantidad: 1 }]
        };
        console.log('🔄 Nuevo estado después de ADD_ITEM:', { items: newState.items.length, itemCount: newState.items.reduce((sum, item) => sum + item.cantidad, 0) });
        return newState;
      }

    case CART_ACTIONS.REMOVE_ITEM:
      console.log('🗑️ REMOVE_ITEM reducer ejecutado con payload:', action.payload);
      console.log('🗑️ Items actuales:', state.items);
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      console.log('🗑️ Items después del filtro:', filteredItems);
      return {
        ...state,
        items: filteredItems
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      const { id, cantidad } = action.payload;
      console.log('🔄 UPDATE_QUANTITY reducer ejecutado con ID:', id, 'cantidad:', cantidad);
      const newState = {
        ...state,
        items: state.items.map(item =>
          item.id === id ? { ...item, cantidad } : item
        )
      };
      console.log('🔄 Nuevo estado después de UPDATE_QUANTITY:', { items: newState.items.length, itemCount: newState.items.reduce((sum, item) => sum + item.cantidad, 0) });
      return newState;

    case CART_ACTIONS.CLEAR_CART:
      console.log('🧹 CLEAR_CART reducer ejecutado');
      return initialState;

    default:
      return state;
  }
};

// Crear contexto
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (producto) => {
    console.log('➕ addItem llamado con producto:', producto.nombre);
    console.log('➕ Estado actual antes de agregar:', { items: state.items.length, itemCount: getItemCount() });
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: producto });
    console.log('➕ addItem dispatch enviado');
  };

  const removeItem = (productoId) => {
    console.log('🗑️ removeItem llamado con ID:', productoId);
    console.log('🗑️ Items antes de eliminar:', state.items);
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productoId });
    console.log('🗑️ removeItem dispatch enviado');
  };

  const updateQuantity = (productoId, cantidad) => {
    console.log('🔄 updateQuantity llamado con ID:', productoId, 'cantidad:', cantidad);
    console.log('🔄 Estado actual antes de actualizar:', { items: state.items.length, itemCount: getItemCount() });
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: productoId, cantidad } });
    console.log('🔄 updateQuantity dispatch enviado');
  };

  const clearCart = () => {
    console.log('🧹 clearCart ejecutado');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    console.log('🧹 clearCart dispatch enviado');
  };

  const getItemCount = () => {
    const count = state.items.reduce((total, item) => total + item.cantidad, 0);
    console.log('🔢 getItemCount calculado:', count, 'para', state.items.length, 'items');
    return count;
  };

  const getTotal = () => {
    const total = state.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    console.log('💰 getTotal calculado:', total, 'para', state.items.length, 'items');
    return total;
  };

  const value = {
    items: state.items,
    total: getTotal(), // Calcular total dinámicamente
    itemCount: getItemCount(),
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

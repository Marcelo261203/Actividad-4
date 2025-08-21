console.log('🧪 Probando Contexto del Carrito...\n');

// Simular el estado inicial
let state = {
  items: [
    {
      id: 'prod1',
      nombre: 'Pizza Margherita',
      precio: 12.50,
      cantidad: 2,
      stock: 10
    },
    {
      id: 'prod2',
      nombre: 'Hamburguesa',
      precio: 8.75,
      cantidad: 1,
      stock: 15
    }
  ]
};

console.log('📦 Estado inicial:', state);

// Simular las acciones
const CART_ACTIONS = {
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART'
};

// Simular el reducer
function cartReducer(state, action) {
  console.log('🔄 Reducer ejecutado con acción:', action.type);
  console.log('📦 Estado antes:', state.items);
  
  switch (action.type) {
    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      console.log('🗑️ Items después de REMOVE_ITEM:', filteredItems);
      return { ...state, items: filteredItems };
      
    case CART_ACTIONS.CLEAR_CART:
      console.log('🧹 Carrito limpiado');
      return { ...state, items: [] };
      
    default:
      return state;
  }
}

// Simular las funciones
function removeItem(productoId) {
  console.log('🗑️ removeItem llamado con ID:', productoId);
  state = cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: productoId });
  console.log('✅ removeItem completado\n');
}

function clearCart() {
  console.log('🧹 clearCart llamado');
  state = cartReducer(state, { type: CART_ACTIONS.CLEAR_CART });
  console.log('✅ clearCart completado\n');
}

// Probar removeItem
console.log('=== PRUEBA 1: REMOVE ITEM ===');
removeItem('prod1');

// Probar clearCart
console.log('=== PRUEBA 2: CLEAR CART ===');
clearCart();

// Verificar estado final
console.log('=== ESTADO FINAL ===');
console.log('📦 Items finales:', state.items);
console.log('✅ Pruebas completadas');

// Verificar que las funciones son llamables
console.log('\n=== VERIFICACIÓN DE FUNCIONES ===');
console.log('typeof removeItem:', typeof removeItem);
console.log('typeof clearCart:', typeof clearCart);
console.log('removeItem es función:', typeof removeItem === 'function');
console.log('clearCart es función:', typeof clearCart === 'function');




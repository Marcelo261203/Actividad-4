import { useCart } from '../context/CartContext';

// Función para diagnosticar el estado del carrito
export const debugCartState = () => {
  const { items, itemCount, total } = useCart();
  
  console.log('🔍 DEBUG CART STATE:');
  console.log('📦 Items en carrito:', items);
  console.log('🔢 ItemCount calculado:', itemCount);
  console.log('💰 Total calculado:', total);
  console.log('📊 Detalles por item:');
  
  items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.nombre}: ${item.cantidad} x $${item.precio} = $${item.cantidad * item.precio}`);
  });
  
  const calculatedItemCount = items.reduce((sum, item) => sum + item.cantidad, 0);
  const calculatedTotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  
  console.log('✅ Verificación:');
  console.log(`  - ItemCount del contexto: ${itemCount}`);
  console.log(`  - ItemCount calculado: ${calculatedItemCount}`);
  console.log(`  - Total del contexto: ${total}`);
  console.log(`  - Total calculado: ${calculatedTotal}`);
  
  if (itemCount !== calculatedItemCount) {
    console.error('❌ PROBLEMA: ItemCount no coincide!');
  }
  
  if (total !== calculatedTotal) {
    console.error('❌ PROBLEMA: Total no coincide!');
  }
  
  return {
    items,
    itemCount,
    total,
    calculatedItemCount,
    calculatedTotal,
    isConsistent: itemCount === calculatedItemCount && total === calculatedTotal
  };
};

// Función para simular operaciones del carrito y verificar consistencia
export const testCartOperations = async () => {
  const { addItem, removeItem, updateQuantity, clearCart, items, itemCount } = useCart();
  
  console.log('🧪 TESTING CART OPERATIONS:');
  console.log('Estado inicial:', { items: items.length, itemCount });
  
  // Simular agregar un producto
  const testProduct = {
    id: 'test-product',
    nombre: 'Producto de Prueba',
    precio: 10.00,
    stock: 5
  };
  
  console.log('➕ Agregando producto de prueba...');
  addItem(testProduct);
  
  // Esperar un momento para que se actualice el estado
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('Estado después de agregar:', { items: items.length, itemCount });
  
  // Verificar consistencia
  const debug = debugCartState();
  
  return debug;
};


#!/usr/bin/env node

console.log('🧪 Script de prueba de botones');
console.log('📱 Para probar los botones:');
console.log('1. Abre la aplicación en web (presiona w)');
console.log('2. Agrega productos al carrito');
console.log('3. Ve al carrito');
console.log('4. Presiona "Vaciar Carrito" - debería mostrar alerta');
console.log('5. Presiona "Realizar Pedido" - debería mostrar alerta de confirmación');
console.log('6. Revisa la consola del navegador para ver los logs');
console.log('');
console.log('🔍 Logs que deberías ver:');
console.log('- 🧹 Botón Vaciar Carrito presionado');
console.log('- 🧹 Ejecutando clearCart...');
console.log('- 🧹 clearCart ejecutado');
console.log('- 🧹 clearCart dispatch enviado');
console.log('- 🧹 CLEAR_CART reducer ejecutado');
console.log('');
console.log('- 🛒 Botón Realizar Pedido presionado');
console.log('- 🚀 handleCheckout iniciado');
console.log('- 📊 Estado actual: { items: X, total: Y }');
console.log('');
console.log('✅ Si ves estos logs, los botones están funcionando');
console.log('❌ Si no ves los logs, hay un problema con los eventos');


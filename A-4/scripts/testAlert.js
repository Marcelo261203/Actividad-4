#!/usr/bin/env node

console.log('🧪 Script de prueba de alertas');
console.log('📱 Para probar las alertas:');
console.log('1. Abre la aplicación en web (presiona w)');
console.log('2. Agrega productos al carrito');
console.log('3. Ve al carrito');
console.log('4. Presiona "Realizar Pedido"');
console.log('5. Deberías ver estos logs en la consola:');
console.log('');
console.log('🛒 Botón Realizar Pedido presionado');
console.log('🚀 handleCheckout iniciado');
console.log('📊 Estado actual: { items: X, total: Y }');
console.log('📋 Mostrando alerta de confirmación...');
console.log('');
console.log('6. Deberías ver una alerta con:');
console.log('   - Título: "Confirmar Pedido"');
console.log('   - Mensaje: "¿Deseas realizar el pedido por $X.XX?"');
console.log('   - Botones: "Cancelar" y "Confirmar"');
console.log('');
console.log('7. Si presionas "Confirmar", deberías ver:');
console.log('✅ Usuario confirmó el pedido');
console.log('🛒 Iniciando proceso de pedido...');
console.log('📦 Items en carrito: [...]');
console.log('📋 Pedido a crear: {...}');
console.log('✅ Pedido creado con ID: ...');
console.log('');
console.log('❌ Si no ves la alerta, hay un problema con Alert.alert');
console.log('❌ Si ves la alerta pero no los logs de confirmación, hay un problema con el callback');




import { productosService, pedidosService } from '../services/firebaseService';

// Función para probar la verificación de stock múltiple
export const testVerificacionStock = async () => {
  try {
    console.log('🧪 Iniciando prueba de verificación de stock...');
    
    // Obtener productos existentes
    const productos = await productosService.getProductos();
    console.log('📦 Productos obtenidos:', productos.length);
    
    if (productos.length === 0) {
      console.log('❌ No hay productos para probar');
      return;
    }
    
    // Crear un pedido de prueba con productos existentes
    const productosPrueba = productos.slice(0, 2).map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: Math.min(2, producto.stock) // Tomar máximo 2 unidades o el stock disponible
    }));
    
    console.log('🧪 Productos de prueba:', productosPrueba);
    
    // Verificar stock múltiple
    const verificaciones = await productosService.verificarStockMultiple(productosPrueba);
    console.log('✅ Verificaciones de stock:', verificaciones);
    
    // Mostrar resumen
    const productosSinStock = verificaciones.filter(v => !v.stockSuficiente);
    const productosConStock = verificaciones.filter(v => v.stockSuficiente);
    
    console.log('📊 Resumen:');
    console.log(`   - Productos con stock suficiente: ${productosConStock.length}`);
    console.log(`   - Productos sin stock suficiente: ${productosSinStock.length}`);
    
    if (productosSinStock.length > 0) {
      console.log('⚠️ Productos sin stock:');
      productosSinStock.forEach(p => {
        console.log(`   • ${p.nombre}: solicitado ${p.cantidadSolicitada}, disponible ${p.stockActual}`);
      });
    }
    
    return verificaciones;
  } catch (error) {
    console.error('❌ Error en prueba de verificación:', error);
    throw error;
  }
};

// Función para probar la creación de pedido con actualización de stock
export const testCrearPedidoConStock = async () => {
  try {
    console.log('🧪 Iniciando prueba de creación de pedido con stock...');
    
    // Obtener productos existentes
    const productos = await productosService.getProductos();
    console.log('📦 Productos obtenidos:', productos.length);
    
    if (productos.length === 0) {
      console.log('❌ No hay productos para probar');
      return;
    }
    
    // Crear un pedido de prueba con productos que tengan stock
    const productosConStock = productos.filter(p => p.stock > 0).slice(0, 2);
    
    if (productosConStock.length === 0) {
      console.log('❌ No hay productos con stock para probar');
      return;
    }
    
    const productosPrueba = productosConStock.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1 // Tomar solo 1 unidad para la prueba
    }));
    
    console.log('🧪 Productos para pedido de prueba:', productosPrueba);
    
    // Crear pedido con validación y actualización de stock
    const pedido = {
      productos: productosPrueba,
      total: productosPrueba.reduce((sum, p) => sum + p.precio, 0),
      cantidadTotal: productosPrueba.length,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    const resultado = await pedidosService.crearPedidoConStock(pedido);
    console.log('✅ Pedido creado exitosamente:', resultado.pedidoId);
    console.log('📊 Actualizaciones de stock:', resultado.actualizacionesStock);
    
    return resultado;
  } catch (error) {
    console.error('❌ Error en prueba de creación de pedido:', error);
    throw error;
  }
};

// Función para mostrar el estado actual del stock
export const mostrarEstadoStock = async () => {
  try {
    console.log('📊 Mostrando estado actual del stock...');
    
    const productos = await productosService.getProductos();
    
    console.log('📦 Estado del stock:');
    productos.forEach(producto => {
      const indicador = producto.stock === 0 ? '❌' : 
                       producto.stock <= 3 ? '⚠️' : '✅';
      console.log(`${indicador} ${producto.nombre}: ${producto.stock} unidades`);
    });
    
    const totalProductos = productos.length;
    const productosSinStock = productos.filter(p => p.stock === 0).length;
    const productosStockBajo = productos.filter(p => p.stock > 0 && p.stock <= 3).length;
    const productosStockNormal = productos.filter(p => p.stock > 3).length;
    
    console.log('\n📈 Resumen:');
    console.log(`   - Total de productos: ${totalProductos}`);
    console.log(`   - Sin stock: ${productosSinStock}`);
    console.log(`   - Stock bajo (≤3): ${productosStockBajo}`);
    console.log(`   - Stock normal (>3): ${productosStockNormal}`);
    
    return {
      total: totalProductos,
      sinStock: productosSinStock,
      stockBajo: productosStockBajo,
      stockNormal: productosStockNormal
    };
  } catch (error) {
    console.error('❌ Error al mostrar estado del stock:', error);
    throw error;
  }
};

// Función principal para ejecutar todas las pruebas
export const ejecutarPruebasStock = async () => {
  try {
    console.log('🚀 Iniciando pruebas de funcionalidad de stock...\n');
    
    // 1. Mostrar estado inicial
    console.log('1️⃣ Estado inicial del stock:');
    await mostrarEstadoStock();
    console.log('');
    
    // 2. Probar verificación de stock
    console.log('2️⃣ Prueba de verificación de stock:');
    await testVerificacionStock();
    console.log('');
    
    // 3. Probar creación de pedido con stock (solo si hay productos con stock)
    console.log('3️⃣ Prueba de creación de pedido con stock:');
    await testCrearPedidoConStock();
    console.log('');
    
    // 4. Mostrar estado final
    console.log('4️⃣ Estado final del stock:');
    await mostrarEstadoStock();
    console.log('');
    
    console.log('✅ Todas las pruebas completadas exitosamente');
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
};



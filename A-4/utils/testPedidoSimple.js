import { pedidosService, productosService } from '../services/firebaseService';

// Función simple para probar la creación de pedidos
export const testCrearPedidoSimple = async (items, total) => {
  try {
    console.log('🧪 Iniciando prueba simple de pedido...');
    console.log('📦 Items recibidos:', items);
    console.log('💰 Total recibido:', total);

    if (!items || items.length === 0) {
      throw new Error('No hay items para procesar');
    }

    // Crear pedido simple
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

    // Usar la función original
    const pedidoId = await pedidosService.crearPedido(pedido);
    
    console.log('✅ Pedido creado exitosamente:', pedidoId);
    
    // Actualizar stock de los productos
    console.log('🔄 Actualizando stock...');
    const actualizacionesStock = await productosService.actualizarStockMultiple(pedido.productos);
    console.log('✅ Stock actualizado:', actualizacionesStock);
    
    return { success: true, pedidoId, pedido, actualizacionesStock };

  } catch (error) {
    console.error('❌ Error en prueba simple:', error);
    return { success: false, error: error.message };
  }
};

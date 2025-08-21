import { productosService, pedidosService } from '../services/firebaseService';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

// Función para probar la conexión básica con Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Probando conexión con Firebase...');
    
    // Intentar obtener productos
    const productos = await productosService.getProductos();
    console.log('✅ Conexión exitosa - Productos obtenidos:', productos.length);
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión con Firebase:', error);
    return false;
  }
};

// Función para probar la creación básica de un pedido
export const testCrearPedidoBasico = async () => {
  try {
    console.log('🧪 Probando creación básica de pedido...');
    
    // Crear un pedido simple sin validaciones
    const pedidoBasico = {
      productos: [
        {
          id: 'test-producto',
          nombre: 'Producto de Prueba',
          precio: 10.00,
          cantidad: 1,
          subtotal: 10.00
        }
      ],
      total: 10.00,
      cantidadTotal: 1,
      fecha: serverTimestamp(),
      estado: 'pendiente'
    };
    
    console.log('📋 Pedido básico a crear:', pedidoBasico);
    
    // Crear directamente en Firestore
    const docRef = await addDoc(collection(db, 'pedidos'), pedidoBasico);
    console.log('✅ Pedido básico creado exitosamente:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al crear pedido básico:', error);
    throw error;
  }
};

// Función para probar la función crearPedido original
export const testCrearPedidoOriginal = async () => {
  try {
    console.log('🧪 Probando función crearPedido original...');
    
    const pedido = {
      productos: [
        {
          id: 'test-producto-2',
          nombre: 'Producto de Prueba 2',
          precio: 15.00,
          cantidad: 2,
          subtotal: 30.00
        }
      ],
      total: 30.00,
      cantidadTotal: 2,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    console.log('📋 Pedido a crear con función original:', pedido);
    
    const pedidoId = await pedidosService.crearPedido(pedido);
    console.log('✅ Pedido creado con función original:', pedidoId);
    
    return pedidoId;
  } catch (error) {
    console.error('❌ Error al crear pedido con función original:', error);
    throw error;
  }
};

// Función para probar la función crearPedidoConStock
export const testCrearPedidoConStock = async () => {
  try {
    console.log('🧪 Probando función crearPedidoConStock...');
    
    // Primero obtener productos reales
    const productos = await productosService.getProductos();
    console.log('📦 Productos disponibles:', productos.length);
    
    if (productos.length === 0) {
      console.log('❌ No hay productos para probar');
      return null;
    }
    
    // Usar el primer producto disponible
    const producto = productos[0];
    console.log('📦 Producto seleccionado:', producto.nombre, 'Stock:', producto.stock);
    
    const pedido = {
      productos: [
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1, // Solo 1 unidad para la prueba
          subtotal: producto.precio
        }
      ],
      total: producto.precio,
      cantidadTotal: 1,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    console.log('📋 Pedido a crear con validación de stock:', pedido);
    
    const resultado = await pedidosService.crearPedidoConStock(pedido);
    console.log('✅ Pedido creado con validación de stock:', resultado.pedidoId);
    console.log('📊 Actualizaciones de stock:', resultado.actualizacionesStock);
    
    return resultado;
  } catch (error) {
    console.error('❌ Error al crear pedido con validación de stock:', error);
    throw error;
  }
};

// Función para verificar pedidos existentes
export const verificarPedidosExistentes = async () => {
  try {
    console.log('📋 Verificando pedidos existentes...');
    
    const pedidos = await pedidosService.getPedidos();
    console.log('📊 Total de pedidos:', pedidos.length);
    
    if (pedidos.length > 0) {
      console.log('📋 Últimos 3 pedidos:');
      pedidos.slice(0, 3).forEach((pedido, index) => {
        console.log(`${index + 1}. Pedido #${pedido.id.slice(-8)} - Total: $${pedido.total} - Estado: ${pedido.estado}`);
      });
    }
    
    return pedidos;
  } catch (error) {
    console.error('❌ Error al verificar pedidos:', error);
    throw error;
  }
};

// Función principal para ejecutar todas las pruebas de diagnóstico
export const ejecutarDiagnosticoPedidos = async () => {
  try {
    console.log('🚀 Iniciando diagnóstico de pedidos...\n');
    
    // 1. Probar conexión con Firebase
    console.log('1️⃣ Probando conexión con Firebase:');
    const conexionOk = await testFirebaseConnection();
    if (!conexionOk) {
      console.log('❌ No se puede continuar sin conexión a Firebase');
      return;
    }
    console.log('');
    
    // 2. Verificar pedidos existentes
    console.log('2️⃣ Verificando pedidos existentes:');
    await verificarPedidosExistentes();
    console.log('');
    
    // 3. Probar creación básica
    console.log('3️⃣ Probando creación básica de pedido:');
    try {
      await testCrearPedidoBasico();
      console.log('✅ Creación básica exitosa');
    } catch (error) {
      console.log('❌ Error en creación básica:', error.message);
    }
    console.log('');
    
    // 4. Probar función original
    console.log('4️⃣ Probando función crearPedido original:');
    try {
      await testCrearPedidoOriginal();
      console.log('✅ Función original exitosa');
    } catch (error) {
      console.log('❌ Error en función original:', error.message);
    }
    console.log('');
    
    // 5. Probar función con validación de stock
    console.log('5️⃣ Probando función crearPedidoConStock:');
    try {
      await testCrearPedidoConStock();
      console.log('✅ Función con validación exitosa');
    } catch (error) {
      console.log('❌ Error en función con validación:', error.message);
    }
    console.log('');
    
    console.log('✅ Diagnóstico completado');
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
};


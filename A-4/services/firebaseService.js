import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  query, 
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Servicios para Productos
export const productosService = {
  // Obtener todos los productos
  async getProductos() {
    try {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  // Agregar un nuevo producto
  async agregarProducto(producto) {
    try {
      const docRef = await addDoc(collection(db, 'productos'), {
        ...producto,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  },

  // Actualizar stock de producto
  async actualizarStock(productoId, nuevoStock) {
    try {
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, {
        stock: Math.max(0, nuevoStock) // No permitir stock negativo
      });
      console.log(`✅ Stock actualizado para producto ${productoId}: ${nuevoStock}`);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw error;
    }
  },

  // Verificar stock disponible
  async verificarStock(productoId, cantidadSolicitada) {
    try {
      const productoRef = doc(db, 'productos', productoId);
      const productoDoc = await getDoc(productoRef);
      if (productoDoc.exists()) {
        const stockActual = productoDoc.data().stock;
        return stockActual >= cantidadSolicitada;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar stock:', error);
      return false;
    }
  },

  // Verificar stock de múltiples productos en tiempo real
  async verificarStockMultiple(productos) {
    try {
      const verificaciones = await Promise.all(
        productos.map(async (producto) => {
          const productoRef = doc(db, 'productos', producto.id);
          const productoDoc = await getDoc(productoRef);
          if (productoDoc.exists()) {
            const stockActual = productoDoc.data().stock;
            const stockSuficiente = stockActual >= producto.cantidad;
            return {
              id: producto.id,
              nombre: producto.nombre,
              stockActual,
              cantidadSolicitada: producto.cantidad,
              stockSuficiente,
              stockDisponible: Math.max(0, stockActual - producto.cantidad)
            };
          }
          return {
            id: producto.id,
            nombre: producto.nombre,
            stockActual: 0,
            cantidadSolicitada: producto.cantidad,
            stockSuficiente: false,
            stockDisponible: 0
          };
        })
      );
      
      return verificaciones;
    } catch (error) {
      console.error('Error al verificar stock múltiple:', error);
      throw error;
    }
  },

  // Actualizar stock de múltiples productos de forma atómica
  async actualizarStockMultiple(productos) {
    try {
      const actualizaciones = productos.map(async (producto) => {
        const productoRef = doc(db, 'productos', producto.id);
        const productoDoc = await getDoc(productoRef);
        if (productoDoc.exists()) {
          const stockActual = productoDoc.data().stock;
          const nuevoStock = Math.max(0, stockActual - producto.cantidad);
          await updateDoc(productoRef, {
            stock: nuevoStock
          });
          console.log(`✅ Stock actualizado para ${producto.nombre}: ${stockActual} → ${nuevoStock}`);
          return {
            id: producto.id,
            nombre: producto.nombre,
            stockAnterior: stockActual,
            stockNuevo: nuevoStock,
            cantidadVendida: producto.cantidad
          };
        }
        throw new Error(`Producto ${producto.id} no encontrado`);
      });

      const resultados = await Promise.all(actualizaciones);
      console.log('✅ Stock actualizado para todos los productos:', resultados);
      return resultados;
    } catch (error) {
      console.error('Error al actualizar stock múltiple:', error);
      throw error;
    }
  }
};

// Servicios para Pedidos
export const pedidosService = {
  // Obtener todos los pedidos
  async getPedidos() {
    try {
      const q = query(collection(db, 'pedidos'), orderBy('fecha', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  },

  // Crear un nuevo pedido
  async crearPedido(pedido) {
    try {
      const pedidoCompleto = {
        ...pedido,
        fecha: serverTimestamp(),
        estado: 'pendiente',
        productos: pedido.productos.map(producto => ({
          ...producto,
          subtotal: producto.precio * producto.cantidad
        }))
      };
      
      const docRef = await addDoc(collection(db, 'pedidos'), pedidoCompleto);
      console.log('✅ Pedido creado exitosamente:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  },

  // Crear pedido con validación y actualización automática de stock
  async crearPedidoConStock(pedido) {
    try {
      console.log('🔄 Iniciando creación de pedido con validación de stock...');
      
      // 1. Verificar stock de todos los productos en tiempo real
      const verificacionesStock = await productosService.verificarStockMultiple(pedido.productos);
      const productosSinStock = verificacionesStock.filter(v => !v.stockSuficiente);
      
      if (productosSinStock.length > 0) {
        const mensajeError = productosSinStock.map(p => 
          `${p.nombre}: solicitado ${p.cantidadSolicitada}, disponible ${p.stockActual}`
        ).join('\n');
        throw new Error(`Stock insuficiente para:\n${mensajeError}`);
      }
      
      console.log('✅ Stock verificado correctamente para todos los productos');
      
      // 2. Crear el pedido
      const pedidoCompleto = {
        ...pedido,
        fecha: serverTimestamp(),
        estado: 'pendiente',
        productos: pedido.productos.map(producto => ({
          ...producto,
          subtotal: producto.precio * producto.cantidad
        }))
      };
      
      const docRef = await addDoc(collection(db, 'pedidos'), pedidoCompleto);
      const pedidoId = docRef.id;
      console.log('✅ Pedido creado exitosamente:', pedidoId);
      
      // 3. Actualizar stock de todos los productos
      const actualizacionesStock = await productosService.actualizarStockMultiple(pedido.productos);
      console.log('✅ Stock actualizado para todos los productos');
      
      return {
        pedidoId,
        actualizacionesStock,
        verificacionesStock
      };
    } catch (error) {
      console.error('❌ Error al crear pedido con stock:', error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  async actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
      const pedidoRef = doc(db, 'pedidos', pedidoId);
      await updateDoc(pedidoRef, {
        estado: nuevoEstado
      });
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      throw error;
    }
  }
};

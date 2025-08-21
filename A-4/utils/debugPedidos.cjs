const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDVGAHpl_L4TBwqEqrSnraqXBgHlcv1JRE",
  authDomain: "pedidosapp-2ef26.firebaseapp.com",
  projectId: "pedidosapp-2ef26",
  storageBucket: "pedidosapp-2ef26.firebasestorage.app",
  messagingSenderId: "542652720164",
  appId: "1:542652720164:web:5011ab1688b048133664b1",
  measurementId: "G-C1KH2JFPJR"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Servicios básicos para pruebas
const productosService = {
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
  }
};

const pedidosService = {
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
  }
};

// Función para probar la conexión básica con Firebase
const testFirebaseConnection = async () => {
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
const testCrearPedidoBasico = async () => {
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
const testCrearPedidoOriginal = async () => {
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

// Función para verificar pedidos existentes
const verificarPedidosExistentes = async () => {
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
const ejecutarDiagnosticoPedidos = async () => {
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
    
    console.log('✅ Diagnóstico completado');
  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
};

// Ejecutar el diagnóstico
ejecutarDiagnosticoPedidos();


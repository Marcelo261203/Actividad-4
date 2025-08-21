#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, updateDoc } = require('firebase/firestore');

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

async function testAppFlow() {
  try {
    console.log('🧪 Simulando flujo de la aplicación...');
    
    // Simular items del carrito (como en la app)
    const items = [
      {
        id: 'test-product-1',
        nombre: 'Pizza Margherita',
        precio: 12.99,
        cantidad: 2,
        stock: 25
      },
      {
        id: 'test-product-2', 
        nombre: 'Hamburguesa Clásica',
        precio: 8.99,
        cantidad: 1,
        stock: 30
      }
    ];
    
    const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    
    console.log('🛒 Items del carrito:', items);
    console.log('💰 Total:', total);
    
    // Crear pedido exactamente como en la app
    const pedido = {
      productos: items.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      })),
      total: total,
      cantidadTotal: cantidadTotal,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    console.log('📋 Pedido a crear:', pedido);
    
    // Crear pedido en Firebase
    const pedidoRef = await addDoc(collection(db, 'pedidos'), pedido);
    const pedidoId = pedidoRef.id;
    console.log('✅ Pedido creado con ID:', pedidoId);
    
    // Actualizar stock (simulado)
    console.log('📦 Actualizando stock...');
    for (const item of items) {
      const nuevoStock = Math.max(0, item.stock - item.cantidad);
      console.log(`✅ Stock actualizado: ${item.nombre} - ${nuevoStock}`);
    }
    
    // Verificar que el pedido se creó
    const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));
    console.log(`📋 Total de pedidos en la base de datos: ${pedidosSnapshot.size}`);
    
    console.log('\n🎉 Flujo de la aplicación simulado exitosamente!');
    console.log('📱 El pedido debería aparecer en la pantalla de Pedidos');
    
  } catch (error) {
    console.error('❌ Error en el flujo:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code
    });
  }
}

testAppFlow();


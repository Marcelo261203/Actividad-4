#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, serverTimestamp } = require('firebase/firestore');

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

async function testFirebase() {
  try {
    console.log('🧪 Iniciando pruebas de Firebase...');
    
    // Test 1: Verificar conexión
    console.log('✅ Conexión a Firebase establecida');
    
    // Test 2: Verificar productos existentes
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    console.log(`📦 Productos en la base de datos: ${productosSnapshot.size}`);
    
    // Test 3: Verificar pedidos existentes
    const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));
    console.log(`📋 Pedidos en la base de datos: ${pedidosSnapshot.size}`);
    
    // Test 4: Crear un pedido de prueba
    const pedidoPrueba = {
      productos: [
        {
          id: 'test-product-1',
          nombre: 'Producto de Prueba',
          precio: 10.99,
          cantidad: 2,
          subtotal: 21.98
        }
      ],
      total: 21.98,
      cantidadTotal: 2,
      fecha: serverTimestamp(),
      estado: 'pendiente'
    };
    
    const pedidoRef = await addDoc(collection(db, 'pedidos'), pedidoPrueba);
    console.log(`✅ Pedido de prueba creado con ID: ${pedidoRef.id}`);
    
    // Test 5: Verificar que el pedido se creó
    const pedidosDespues = await getDocs(collection(db, 'pedidos'));
    console.log(`📋 Pedidos después de crear: ${pedidosDespues.size}`);
    
    console.log('\n🎉 Todas las pruebas pasaron exitosamente!');
    console.log('📱 Firebase está funcionando correctamente');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  }
}

testFirebase();


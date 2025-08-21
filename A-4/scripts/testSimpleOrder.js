#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

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

async function testSimpleOrder() {
  try {
    console.log('🧪 Probando creación simple de pedido...');
    
    // Pedido simple
    const pedidoSimple = {
      productos: [
        {
          id: 'test-simple-1',
          nombre: 'Producto de Prueba Simple',
          precio: 10.00,
          cantidad: 1,
          subtotal: 10.00
        }
      ],
      total: 10.00,
      cantidadTotal: 1,
      fecha: new Date(),
      estado: 'pendiente'
    };
    
    console.log('📋 Pedido a crear:', pedidoSimple);
    
    // Crear pedido
    const pedidoRef = await addDoc(collection(db, 'pedidos'), pedidoSimple);
    console.log('✅ Pedido creado con ID:', pedidoRef.id);
    
    // Verificar que se creó
    const pedidosSnapshot = await getDocs(collection(db, 'pedidos'));
    console.log(`📋 Total de pedidos en la base de datos: ${pedidosSnapshot.size}`);
    
    // Mostrar todos los pedidos
    console.log('\n📋 Todos los pedidos en la base de datos:');
    pedidosSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ID: ${doc.id}`);
      console.log(`  Total: $${data.total}`);
      console.log(`  Estado: ${data.estado}`);
      console.log(`  Productos: ${data.productos.length}`);
      console.log('');
    });
    
    console.log('🎉 Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}

testSimpleOrder();




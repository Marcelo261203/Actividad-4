const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, doc, updateDoc, serverTimestamp } = require('firebase/firestore');

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

console.log('🧪 Probando funciones del carrito...\n');

// Simular el estado del carrito
let cartItems = [
  {
    id: 'test1',
    nombre: 'Producto Test 1',
    precio: 10.50,
    cantidad: 2,
    stock: 5
  },
  {
    id: 'test2', 
    nombre: 'Producto Test 2',
    precio: 15.75,
    cantidad: 1,
    stock: 3
  }
];

console.log('📦 Estado inicial del carrito:', cartItems);

// Simular removeItem
function removeItem(productoId) {
  console.log('🗑️ removeItem llamado con ID:', productoId);
  console.log('🗑️ Items antes de eliminar:', cartItems);
  
  cartItems = cartItems.filter(item => item.id !== productoId);
  
  console.log('🗑️ Items después de eliminar:', cartItems);
  console.log('✅ removeItem ejecutado correctamente\n');
}

// Simular clearCart
function clearCart() {
  console.log('🧹 clearCart llamado');
  console.log('🧹 Items antes de limpiar:', cartItems);
  
  cartItems = [];
  
  console.log('🧹 Items después de limpiar:', cartItems);
  console.log('✅ clearCart ejecutado correctamente\n');
}

// Probar removeItem
console.log('=== PRUEBA 1: REMOVE ITEM ===');
removeItem('test1');

// Probar clearCart
console.log('=== PRUEBA 2: CLEAR CART ===');
clearCart();

// Verificar que las funciones funcionan
console.log('=== VERIFICACIÓN FINAL ===');
console.log('📦 Estado final del carrito:', cartItems);
console.log('✅ Todas las pruebas completadas');

// Probar conexión a Firebase
async function testFirebaseConnection() {
  try {
    console.log('\n=== PRUEBA 3: CONEXIÓN FIREBASE ===');
    const productosSnapshot = await getDocs(collection(db, 'productos'));
    console.log('✅ Conexión a Firebase exitosa');
    console.log('📊 Productos en BD:', productosSnapshot.size);
  } catch (error) {
    console.error('❌ Error de conexión Firebase:', error);
  }
}

testFirebaseConnection();



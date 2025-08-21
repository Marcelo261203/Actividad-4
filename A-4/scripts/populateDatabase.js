#!/usr/bin/env node

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

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

// Datos de productos con imágenes de Unsplash
const productos = [
  {
    nombre: "Pizza Margherita",
    descripcion: "Pizza clásica italiana con tomate, mozzarella y albahaca fresca. Masa artesanal horneada en horno de piedra.",
    precio: 12.99,
    stock: 25,
    imagen: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Hamburguesa Clásica",
    descripcion: "Hamburguesa con carne de res 100% natural, lechuga, tomate, cebolla y queso cheddar. Acompañada de papas fritas.",
    precio: 8.99,
    stock: 30,
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Ensalada César",
    descripcion: "Ensalada fresca con lechuga romana, crutones, parmesano y aderezo César casero. Opción saludable y deliciosa.",
    precio: 7.50,
    stock: 15,
    imagen: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Pasta Carbonara",
    descripcion: "Pasta italiana con salsa cremosa de huevo, queso parmesano, panceta y pimienta negra. Auténtico sabor italiano.",
    precio: 11.99,
    stock: 20,
    imagen: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Sushi Roll California",
    descripcion: "Roll de sushi con cangrejo, aguacate y pepino. Perfecto para principiantes en el mundo del sushi.",
    precio: 9.99,
    stock: 18,
    imagen: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Tacos de Carne Asada",
    descripcion: "Tacos mexicanos con carne asada, cebolla, cilantro y salsa verde. Servidos con tortillas de maíz frescas.",
    precio: 6.99,
    stock: 22,
    imagen: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Pollo a la Parrilla",
    descripcion: "Pechuga de pollo a la parrilla con hierbas aromáticas. Acompañada de vegetales asados y arroz integral.",
    precio: 10.99,
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Sopa de Tomate",
    descripcion: "Sopa cremosa de tomate con albahaca fresca y crutones. Perfecta para días fríos o como entrada.",
    precio: 5.99,
    stock: 8,
    imagen: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Tiramisú",
    descripcion: "Postre italiano clásico con capas de bizcocho empapado en café, crema de mascarpone y cacao en polvo.",
    precio: 4.99,
    stock: 10,
    imagen: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Limonada Natural",
    descripcion: "Limonada fresca preparada con limones naturales y azúcar. Refrescante y perfecta para acompañar cualquier comida.",
    precio: 2.99,
    stock: 35,
    imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop&crop=center"
  },
  {
    nombre: "Café Americano",
    descripcion: "Café negro preparado con granos de café arábica tostados. Perfecto para comenzar el día con energía.",
    precio: 3.50,
    stock: 50,
    imagen: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop&crop=center"
  }
];

async function poblarBaseDeDatos() {
  try {
    console.log('🍕 Iniciando población de la base de datos...');
    
    const productosRef = collection(db, 'productos');
    
    for (const producto of productos) {
      const productoConTimestamp = {
        ...producto,
        createdAt: serverTimestamp()
      };
      
      await addDoc(productosRef, productoConTimestamp);
      console.log(`✅ Producto agregado: ${producto.nombre}`);
    }
    
    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log(`📊 Se agregaron ${productos.length} productos`);
    console.log('\n📱 Ahora puedes ejecutar la aplicación y ver los productos con imágenes.');
    
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  }
}

// Ejecutar la función
poblarBaseDeDatos();

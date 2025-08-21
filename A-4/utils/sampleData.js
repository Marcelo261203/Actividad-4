// Datos de ejemplo para poblar la base de datos Firebase
export const sampleProductos = [
  {
    nombre: "Pizza Margherita",
    descripcion: "Pizza clásica italiana con tomate, mozzarella y albahaca fresca. Masa artesanal horneada en horno de piedra.",
    precio: 12.99,
    stock: 25,
    imagen: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400"
  },
  {
    nombre: "Hamburguesa Clásica",
    descripcion: "Hamburguesa con carne de res 100% natural, lechuga, tomate, cebolla y queso cheddar. Acompañada de papas fritas.",
    precio: 8.99,
    stock: 30,
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400"
  },
  {
    nombre: "Ensalada César",
    descripcion: "Ensalada fresca con lechuga romana, crutones, parmesano y aderezo César casero. Opción saludable y deliciosa.",
    precio: 7.50,
    stock: 15,
    imagen: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400"
  },
  {
    nombre: "Pasta Carbonara",
    descripcion: "Pasta italiana con salsa cremosa de huevo, queso parmesano, panceta y pimienta negra. Auténtico sabor italiano.",
    precio: 11.99,
    stock: 20,
    imagen: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400"
  },
  {
    nombre: "Sushi Roll California",
    descripcion: "Roll de sushi con cangrejo, aguacate y pepino. Perfecto para principiantes en el mundo del sushi.",
    precio: 9.99,
    stock: 18,
    imagen: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400"
  },
  {
    nombre: "Tacos de Carne Asada",
    descripcion: "Tacos mexicanos con carne asada, cebolla, cilantro y salsa verde. Servidos con tortillas de maíz frescas.",
    precio: 6.99,
    stock: 22,
    imagen: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400"
  },
  {
    nombre: "Pollo a la Parrilla",
    descripcion: "Pechuga de pollo a la parrilla con hierbas aromáticas. Acompañada de vegetales asados y arroz integral.",
    precio: 10.99,
    stock: 12,
    imagen: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400"
  },
  {
    nombre: "Sopa de Tomate",
    descripcion: "Sopa cremosa de tomate con albahaca fresca y crutones. Perfecta para días fríos o como entrada.",
    precio: 5.99,
    stock: 8,
    imagen: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"
  },
  {
    nombre: "Tiramisú",
    descripcion: "Postre italiano clásico con capas de bizcocho empapado en café, crema de mascarpone y cacao en polvo.",
    precio: 4.99,
    stock: 10,
    imagen: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400"
  },
  {
    nombre: "Limonada Natural",
    descripcion: "Limonada fresca preparada con limones naturales y azúcar. Refrescante y perfecta para acompañar cualquier comida.",
    precio: 2.99,
    stock: 35,
    imagen: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400"
  }
];

// Función para agregar productos de ejemplo a Firebase
export const populateSampleData = async (productosService) => {
  try {
    for (const producto of sampleProductos) {
      await productosService.agregarProducto(producto);
    }
    console.log('Datos de ejemplo agregados exitosamente');
  } catch (error) {
    console.error('Error al agregar datos de ejemplo:', error);
  }
};

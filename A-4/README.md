# 🛒 Online Order Management App

Una aplicación móvil desarrollada con React Native y Expo para la gestión de pedidos online con sistema de carrito de compras y gestión de inventario en tiempo real.

## 🚀 Características

### ✅ Funcionalidades Implementadas
- **Catálogo de Productos**: Visualización de productos con información detallada
- **Carrito de Compras**: Gestión de productos con controles de cantidad
- **Gestión de Pedidos**: Creación y visualización de pedidos
- **Validación de Stock**: Verificación en tiempo real del inventario disponible
- **Actualización Automática**: Descuento automático de stock al realizar pedidos
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar

### 🎯 Funcionalidades Específicas
- **Botones de Control**: Agregar, restar y eliminar productos del carrito
- **Contador de Productos**: Indicador visual en la navegación
- **Validaciones de Stock**: Prevención de pedidos sin stock suficiente
- **Sistema de Alertas**: Notificaciones para el usuario
- **Navegación por Pestañas**: Interfaz organizada y accesible

## 🛠️ Tecnologías Utilizadas

- **React Native**: Framework para desarrollo móvil
- **Expo**: Plataforma de desarrollo y herramientas
- **Firebase Firestore**: Base de datos NoSQL en tiempo real
- **React Navigation**: Navegación entre pantallas
- **Context API**: Gestión de estado global (carrito)

## 📱 Estructura del Proyecto

```
├── App.js                 # Componente principal
├── package.json           # Dependencias y scripts
├── components/            # Componentes reutilizables
│   └── ProductCard.js     # Tarjeta de producto
├── context/               # Contextos de React
│   └── CartContext.js     # Gestión del carrito
├── navigation/            # Configuración de navegación
│   └── AppNavigator.js    # Navegador principal
├── screens/               # Pantallas de la aplicación
│   ├── ProductosScreen.js # Catálogo de productos
│   ├── CarritoScreen.js   # Carrito de compras
│   └── PedidosScreen.js   # Historial de pedidos
├── services/              # Servicios de Firebase
│   └── firebaseService.js # Operaciones de base de datos
└── utils/                 # Utilidades y herramientas
    ├── cartDebug.js       # Diagnóstico del carrito
    ├── stockTest.js       # Pruebas de stock
    └── debugPedidos.cjs   # Diagnóstico de pedidos
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI
- Expo Go (aplicación móvil para pruebas)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
   git clone https://github.com/Marcelo261203/Actividad-4.git
   cd A-4
```

2. **Instalar dependencias**
```bash
npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en Firebase Console
   - Habilitar Firestore Database
   - Configurar las credenciales en `services/firebaseService.js`

4. **Ejecutar la aplicación**

   **📱 Versión Móvil:**
   ```bash
   npm start
   ```

   **🌐 Versión Web:**
```bash
npm run web
```

5. **Probar la aplicación**
   - **Móvil**: Escanear el código QR con Expo Go
   - **Web**: Abrir http://localhost:19006 en el navegador

## 📊 Funcionalidades del Sistema

### Gestión de Productos
- Visualización de catálogo con imágenes y precios
- Información de stock disponible
- Indicadores visuales de stock bajo

### Carrito de Compras
- Agregar productos con controles de cantidad
- Restar productos individualmente
- Eliminar productos completamente
- Cálculo automático de totales

### Sistema de Pedidos
- Creación de pedidos con validación de stock
- Actualización automática del inventario
- Historial de pedidos realizados

### Validaciones de Stock
- Verificación en tiempo real
- Prevención de pedidos sin stock
- Alertas informativas al usuario

## 🧪 Scripts de Prueba

El proyecto incluye varios scripts para diagnóstico y pruebas:

```bash
# Pruebas de stock
npm run test-stock

# Diagnóstico de pedidos
npm run debug-pedidos

# Iniciar aplicación
npm start
```

## 🔍 Diagnóstico y Debugging

### Herramientas de Diagnóstico
- **Botón Debug**: Verificar estado del carrito
- **Botón Test Add**: Agregar productos de prueba
- **Logs Detallados**: Seguimiento de operaciones
- **Verificación de Consistencia**: Validación de cálculos

### Monitoreo en Tiempo Real
- Logs de operaciones del carrito
- Verificación de consistencia de datos
- Alertas de errores y problemas

## 🌐 Versión Web

### **¡Tu Aplicación También Funciona en Web!**

Además de la versión móvil, tu aplicación **Pedidos Online** también está disponible como aplicación web con todas las funcionalidades completas.

### **🚀 Cómo Acceder a la Versión Web:**

```bash
# Iniciar la versión web
npm run web

# Versión de producción optimizada
npm run build-web
```

### **✅ Funcionalidades Web Completas:**
- 📋 **Catálogo de Productos** - Visualización completa
- 🛒 **Carrito de Compras** - Gestión completa
- ➕➖ **Controles de Cantidad** - Agregar/quitar productos
- 📊 **Gestión de Stock** - Validación en tiempo real
- 💳 **Procesamiento de Pedidos** - Creación automática
- 📈 **Historial de Pedidos** - Visualización completa
- 🔄 **Actualización Automática** - Stock se actualiza automáticamente

### **🌐 Acceso Web:**
- **URL Local**: `http://localhost:19006`
- **Navegadores Soportados**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: PC, Laptop, Tablet, Móvil (modo escritorio)

### **📖 Documentación Web:**
Para más detalles sobre la versión web, consulta: [WEB_README.md](WEB_README.md)

## 📱 Capturas de Pantalla

*[Aquí puedes agregar capturas de pantalla de tu aplicación]*

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tuusuario](https://github.com/tuusuario)

## 🙏 Agradecimientos

- React Native Community
- Expo Team
- Firebase Team
- Instructores y compañeros de clase

---

**Nota**: Este proyecto fue desarrollado como parte del curso de Aplicaciones Móviles en la UPDS.

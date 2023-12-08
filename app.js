import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewRoutes from './routes/views.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { cartRouter } from './routes/carts.routes.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080; // Cambié el puerto a 8080

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Servir archivos estáticos
app.use(express.static(__dirname + '/public'));

// Rutas
app.use('/', viewRoutes);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});

// Configuración de Socket.io
const io = new Server(httpServer);
const productManager = new ProductManager(io);

// Manejo de conexiones de socket
io.on('connection', async (socket) => {
  try {
    console.log('Nuevo cliente conectado');

    const products = await productManager.consultarProductos();
    io.to(socket.id).emit('realTimeProductsUpdate', { products });

    socket.on('addProduct', async (data) => {
      console.log('Mensaje recibido desde el cliente:', data);
      try {
        if (data === 'productChanged') {
          const products = await productManager.consultarProductos();
          io.emit('realTimeProductsUpdate', { products });
        }
      } catch (error) {
        console.error('Error al manejar el mensaje:', error.message);
      }
    });
  } catch (error) {
    console.error('Error en la conexión de socket:', error.message);
  }
});

export default app;
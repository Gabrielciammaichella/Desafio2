// app.js
import express from 'express';
import { Pool } from 'pg';
import { generateUniqueId } from './utils';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import viewRouters from './routes/views.routes.js';
import { productsRouters } from './routes/products.routes.js';
import { cartRouter } from './routes/carts.routes.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'eCommerceDB',
  password: 'tu_contraseña',
  port: 5432,
});

app.use(express.json());

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  const productId = req.params.pid;
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

productsRouter.post('/', async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
  } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO products (title, description, code, price, stock, category, thumbnails, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails,
        status,
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar el producto' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE products SET title = $1, description = $2, code = $3, price = $4, stock = $5, category = $6, thumbnails = $7, status = $8 WHERE id = $9 RETURNING *',
      [
        updatedProduct.title,
        updatedProduct.description,
        updatedProduct.code,
        updatedProduct.price,
        updatedProduct.stock,
        updatedProduct.category,
        updatedProduct.thumbnails,
        updatedProduct.status,
        productId,
      ]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);

    if (rows.length > 0) {
      res.json({ message: 'Producto eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

app.use('/api/products', productsRouter);


const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {

  res.status(201).json({ message: 'Nuevo carrito creado' });
});

app.use('/api/carts', cartsRouter);



// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
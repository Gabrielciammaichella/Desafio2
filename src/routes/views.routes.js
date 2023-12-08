import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.consultarProductos();

    res.render('home', { products });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts'); 
});

export default router;
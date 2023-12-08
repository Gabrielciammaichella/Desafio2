import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await productManager.consultarProductos();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const product = await productManager.getProductById(productId);

    if (!product) {
      res.status(404).json({
        error: 'Producto no encontrado',
      });
    } else {
      res.json({ product });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const addedProduct = await productManager.addProduct(newProduct);
    const latestProduct = addedProduct[addedProduct.length - 1];

    req.app.get('socketServer').emit('addProduct', { product: latestProduct });

    res.status(201).json({ product: latestProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    const updatedData = req.body;

    const existingProduct = await productManager.getProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({
        error: 'Producto no encontrado',
      });
    }

    const updatedProduct = {
      ...existingProduct,
      ...updatedData,
      id: productId,
    };

    await productManager.updateProduct(productId, updatedProduct);

    req.app.get('socketServer').emit('message', 'productChanged');

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = Number(req.params.pid);
    await productManager.deleteProduct(productId);

    req.app.get('socketServer').emit('message', 'productChanged');

    res.json({ success: true, message: `Producto con ID ${productId} eliminado` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
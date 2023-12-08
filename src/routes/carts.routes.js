import { Router } from 'express';
import { CartManager } from '../managers/CartManager.js';

const path = 'Carts.json';
const router = Router();
const cartManager = new CartManager(path);

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json({
      status: 'success',
      carts: carts,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener carritos',
      error: error.message,
    });
  }
});

router.get('/:cid', async (req, res) => {
  const cid = req.params.cid;

  try {
    const productsInCart = await cartManager.getProductsInCart(cid);

    res.status(200).json({
      status: 'success',
      cartId: cid,
      products: productsInCart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error al obtener productos del carrito. CID: ${cid}`,
      error: error.message,
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart(req.body);
    res.status(201).json({
      status: 'success',
      cart: newCart,
    });
  } catch (error) {
    console.error('Error al crear un nuevo carrito:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear un nuevo carrito',
    });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);

    res.status(200).json({
      status: 'success',
      message: `Producto agregado al carrito. CID: ${cid} PID: ${pid} Cantidad: ${quantity}`,
      cart: updatedCart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Error al agregar un producto al carrito. CID: ${cid} PID: ${pid}`,
      error: error.message,
    });
  }
});

export default router;
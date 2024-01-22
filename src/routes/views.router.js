import express from 'express';
import {ProductManager} from '../ProductManager.js';
const router = express.Router();

const productManager = new ProductManager('./src/products.json');

router.get('/', async (req, res) => {

    const products = await productManager.getProducts();
    res.render('home', {products});
});

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts');
});

export default router;
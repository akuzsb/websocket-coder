import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import viewRouter from './routes/views.router.js';
import { ProductManager } from './ProductManager.js';

const productManager = new ProductManager('./src/products.json');


const app = express();
const PORT = 4000;

const httpServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - http://localhost:${PORT}`);
});

export const socketServer = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


app.use('/', viewRouter);

app.post('/api/products', async (req, res) => {
    try {

        await productManager.addProduct(req.body);
        let products = await productManager.getProducts();
        socketServer.emit('products', products);
        res.json({ message: 'Producto agregado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

socketServer.on('connection', async (socket) => {
    console.log('Cliente conectado');

    const products = await productManager.getProducts();
    socket.emit('products', products);

    socket.on('delete', async (id) => {
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        socket.emit('products', products);
    });

    socket.on('new-product', async (product) => {
        await productManager.addProduct(product);
        const products = await productManager.getProducts();
        socket.emit('products', products);
    });

});

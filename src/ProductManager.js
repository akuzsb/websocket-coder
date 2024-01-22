import fs from 'node:fs/promises';
export class ProductManager {
    #products = [];
    #id = 0;
    #path = '';

    constructor(path) {
        if (!path) throw new Error('Path es requerido');
        this.#path = path;
    }

    async getProducts() {
        let products = await fs.readFile(this.#path, 'utf-8');
        this.#products = products ? JSON.parse(products) : [];
        return this.#products;
    }

    getProductById = async (id) => {
        const products = await this.getProducts();
        const product = products.find(p => p.id == id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async getIdProduct() {
        let products = await this.getProducts();
        if (!products.length) return 0;
        this.#id = Math.max(...products.map(p => p.id));
        return this.#id;
    }

    async addProduct(product) {
        if (product.code && this.#products.find(p => p.code === product.code)) {
            throw new Error('No se puede agregar un producto con el mismo código');
        }
        this.#id = await this.getIdProduct() + 1;
        let products = await this.getProducts();
        products.push({
            id: this.#id,
            ...product
        });
        await this.saveProducts(products);
        return ({ ...product, id: this.#id })
    }

    async saveProducts(products) {
        await fs.writeFile(this.#path, JSON.stringify(products));
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(p => p.id !== id);
        await this.saveProducts(products);
    }

    async updateProduct({ id, product }) {
        let products = await this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) {
            throw new Error('Not found');
        }
        products[index] = {
            ...products[index],
            ...product
        }
        await this.saveProducts(products);
    }

}
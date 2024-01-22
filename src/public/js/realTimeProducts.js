const socket = io();

socket.on('products', (data) => {
    const tbody = document.querySelector('#tbody');
    let html = ""

    data.forEach(product => {
        html += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.code}</td>
                <td>${product.stock}</td>
                <td>${product.status}</td>
                <td>$ ${product.price}</td>
                <td>
                    <button onClick="eliminarProducto(${product.id})" class="btn btn-danger">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML = html;
    });
});

const eliminarProducto = (id) => {
    socket.emit('delete', id);
}

const formulario = document.querySelector('#productForm');
formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const product = {
        title: formulario.title.value,
        code: formulario.code.value,
        price: formulario.price.value,
        stock: formulario.stock.value,
        status: formulario.status.value
    }
    socket.emit('new-product', product);
    formulario.reset();
});
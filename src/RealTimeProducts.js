document.addEventListener('DOMContentLoaded', function () {
    const socket = io.connect('http://localhost:8080'); // Cambiado el puerto a 8080
  
    socket.on('realTimeProductsUpdate', function (data) {
      console.log('Productos actualizados en tiempo real:', data.products);
  
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';
  
      data.products.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>${product.title}</strong>
          <p>${product.description}</p>
          <p>Precio: ${product.price}</p>
          <p>Stock: ${product.stock}</p>
          <!-- Agrega más características según sea necesario -->
        `;
        productList.appendChild(listItem);
      });
    });
  });
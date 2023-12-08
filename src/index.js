const ejs = require('ejs'); // Asegúrate de que ejs esté instalado: npm install ejs

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
  
    // Supongamos que products es un array de productos que obtienes de alguna parte
    const products = [
        { title: 'Producto 1', price: 100, stock: 10 },
        { title: 'Producto 2', price: 200, stock: 5 },
        // ... otros productos ...
    ];

    // Renderizar la plantilla Home.handlebars y enviar el HTML al cliente a través del socket
    const renderHomeHTML = async (products) => {
        try {
            const html = await ejs.renderFile(__dirname + '/views/Home.handlebars', { products });
            socket.emit('updateDOM', { html });
        } catch (error) {
            console.error('Error al renderizar la plantilla:', error.message);
        }
    };

    // Llamar a la función para enviar el HTML cuando se conecta un nuevo cliente
    renderHomeHTML(products);
});

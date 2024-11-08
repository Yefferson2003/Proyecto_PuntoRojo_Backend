import server from './server';


const port = process.env.PORT || 4000; // Declaración del puerto

// Iniciar servidor en el puerto declarado
server.listen(port, () => {
    console.log(`REST API funcionando desde el puerto: ${port}`);
});

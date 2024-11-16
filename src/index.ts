import httpServer from './server';

const port = process.env.PORT || 4000; 

httpServer.listen(port, () => {
    console.log(`REST API funcionando desde el puerto: ${port}`);
});

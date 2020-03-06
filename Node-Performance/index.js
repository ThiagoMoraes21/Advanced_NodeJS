const cluster = require('cluster');

// Is the file being executed in master mode?
if(cluster.isMaster) {
    // Cause index.js to be executed *again* but in child mode
    console.log('IS MASTER: ', cluster.isMaster); 
    cluster.fork();
} else {
    console.log('IS MASTER: ', cluster.isMaster); 
    const express = require('express');
    const app = express();
    
    // computation intensive code, simulating a large request
    function doWork(duration) {
        const start = Date.now();
        while(Date.now() - start < duration) {}
    }
    
    app.get('/', (req, res) => {
        doWork(5000); 
        res.send('HI THERE!');
    });
    
    app.listen(3000, () => console.log('Server is running...')); 
}

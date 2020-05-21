process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');

// Is the file being executed in master mode?
if(cluster.isMaster) {
    // Cause index.js to be executed *again* but in worker mode
    console.log('Is master fork: ', cluster.isMaster); 
    cluster.fork();

} else {
    console.log('Is worker fork: ', cluster.isWorker); 
    const express = require('express');
    const app = express();
    const crypto = require('crypto');
    
    app.get('/', (req, res) => {
        const start = Date.now();
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            console.log(`PBKDF2 response time: ${Date.now() - start}ms `);
            res.status(200).send('PBKDF2 was called.');
        });
    });

    app.get('/fast', (req, res) => { 
        res.send('THIS WAS FAST!');
    }); 

    app.listen(3000, () => console.log('Server is running...')); 
}

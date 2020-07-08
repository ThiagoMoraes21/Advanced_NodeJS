const express = require('express');
const app = express(); 
const Worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
    const worker = new Worker(function() {
        // This function does not modify any external code,
        // because it's going to get stringfy and being throw in another area of 
        // the computer. Thats why we use the "postMessage" and "onmessage".

        this.onmessage = function() {
            let counter = 0;
            while(counter < 1e9) {
                counter++;
            }

            postMessage(counter);
        }
    });

    worker.onmessage = function(message) {
        console.log('Result: ', message);
        return res.status(200).send(String(message.data));
    }

    worker.postMessage();
});

app.get('/fast', (req, res) => { 
    return res.status(200).send('THIS WAS FAST!');
}); 

app.listen(3000, () => console.log('Server is running...')); 
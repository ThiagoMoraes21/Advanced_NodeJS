process.env.UV_THREADPOOL_SIZE = 5;
const https = require('https');
const start = Date.now();
const crypto = require('crypto');
const fs = require('fs');

function doRequests(num=1) {
    for(let i = 0; i < num; i++) {
        https.request('https://www.google.com', res =>  {
            res.on('data', () => {});
            res.on('end', () => {
                console.log(`Do Request: ${ Date.now() - start }ms`);
            });
        }).end();
    }
}

function execPBKDF2(num=1) {
    for(let i = 0; i < num; i++) {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            console.log(`Hash: ${ Date.now() - start }ms`);
        });     
    }
}


doRequests();

// read the multitaks file
fs.readFile('multitaks.js', 'utf8', () => {
    console.log('FS: ', Date.now() - start);
});

execPBKDF2(4); 
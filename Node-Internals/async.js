/*******************************************************
    Understanding OS Taks running behind the scenes
    (OS Async Helpers!)
********************************************************/  

// fetch google home page and calculates how long it takes
const https = require('https');
const start = Date.now();


function doRequests(num) {
    for(let i = 0; i < num; i++) {
        https.request('https://www.google.com', res =>  {
            res.on('data', () => {});
            res.on('end', () => {
                console.log(`${ Date.now() - start }ms`);
            });
        }).end();
    }
}

doRequests(6);


/***********************************************************************************
    Libuv delegates the request making to the underlying 
    operating system. 
    
    So it's actually our operating system that does the real HTTP requests,
    libuv is used to issue the requests, and then it just waits on the 
    operating system to emit a signal that some response has come back
    to the request.

    So because libuv is delegating the work done to the operating system,
    the operating systemc itself decides whether to make a new thread or not.
    Or just generally how to handle the entire process of making the request.

    And because the operating system is making the request, there is no blocking
    of our javascript code inside the event loop or enything else inside 
    of our application.
    
***********************************************************************************/
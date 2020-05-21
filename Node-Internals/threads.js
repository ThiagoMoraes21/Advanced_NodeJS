// NODE EVENT LOOP ---------------------> SINGLE THREADED
// SOME NODE FRAMEWORK/STD LIB ---------> NOT SINGLE THREADED

// setup the number of threads to be opened on the thread pool
process.env.UV_THREADPOOL_SIZE = 5;

// Trying to detect if Node.js is or not single threaded.
const crypto = require('crypto');

// Start is going to record the time at which we started our 
// call to the PBKDF2 function
const start = Date.now();

// Running a crypto hash function and bachmarking exatacly
// how long it takes to execute on our computer.
function execPBKDF2(num) {
    for(let i = 0; i < num; i++) {
        crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
            console.log(`${ i }: ${ Date.now() - start }ms`);
        });     
    }
}
  
execPBKDF2(5);
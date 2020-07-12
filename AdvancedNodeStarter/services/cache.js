const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
    console.log('Running query...');
    return exec.apply(this, arguments);
}
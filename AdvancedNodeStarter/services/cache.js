const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const exec = mongoose.Query.prototype.exec;
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

mongoose.Query.prototype.cache = function() {
    this.useCache = true;
    return this;
}

mongoose.Query.prototype.exec = async function () {
    if(!this.useCache) {
        return exec.apply(this, arguments);
    }

    // this refers to the current query that we a trying to run.
    // ex: Blogs.find({user: id}): this === {user: '123456'}
    const key = JSON.stringify(Object.assign({}, this.getQuery(), { 
        collection: this.mongooseCollection.name 
    }));

    // See if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    // if we do, return that
    if(cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? 
            doc.map(el => new this.model(el)) :
            new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    client.set(key, JSON.stringify(result));

    return result;
}
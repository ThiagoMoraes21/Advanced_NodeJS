const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const exec = mongoose.Query.prototype.exec;
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
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
    const cacheValue = await client.hget(this.hashKey, key);

    // if we do, return that
    if(cacheValue) {
        const doc = JSON.parse(cacheValue);

        return Array.isArray(doc) ? 
            doc.map(el => new this.model(el)) :
            new this.model(doc);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments);

    // 'EX' extends form expiration, and 10 is 10 seconds
    // so the cache expires in 10 seconds
    client.hset(this.hashKey, key, JSON.stringify(result));
    client.expire(this.hashKey, 10);

    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};
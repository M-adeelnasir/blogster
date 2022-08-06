const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const exec = mongoose.Query.prototype.exec;

const client = redis.createClient()
client.get = util.promisify(client.get)

mongoose.Query.prototype.exec = async function () {

    // console.log("I am ran before the actual query executed")
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);

    const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))

    //if we have value against the 'key' in redis
    const cachedValue = await client.get(key)
    //if we have then return it
    if (cachedValue) {
        console.log(cachedValue);
    }
    // if not then issue the mongo query and store the data in redis



    const result = await exec.apply(this, arguments)
    console.log("Result ===>", result);
}


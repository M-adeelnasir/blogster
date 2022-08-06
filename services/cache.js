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
        // console.log(cachedValue);
        // return JSON.parse(cachedValue)  //this is not going to work bcz it not a mongoose object first we have to convert it into a mongo object
        const doc = JSON.parse(cachedValue)
        // this also not going to work bcz model can only work with signle document bul redis rreturn an 'Array'
        // return new this.model(docs)

        console.log("Value From Cache");

        //solution
        Array.isArray(doc)
            ?
            doc.map(d => new this.model(d))
            :
            new this.model(doc)


    }
    // if not then issue the mongo query and store the data in redis
    const result = await exec.apply(this, arguments)
    // console.log("Result ===>", result);

    client.set(key, JSON.stringify(result))

    return result
}


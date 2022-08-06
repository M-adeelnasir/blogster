const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const exec = mongoose.Query.prototype.exec;

const client = redis.createClient()
client.get = util.promisify(client.get)


//check what should be cached and what not
mongoose.Query.prototype.cache = function () {
    this.useCache = true;

    return this //this make you able to do chain able like .cache().limit().sort().populate() etc
}



mongoose.Query.prototype.exec = async function () {

    if (!this.useCache) {
        console.log("is applied");

        return exec.apply(this, arguments)
    }



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
        return Array.isArray(doc)
            ?
            doc.map(d => new this.model(d))
            :
            new this.model(doc)
    }
    // if not then issue the mongo query and store the data in redis
    const result = await exec.apply(this, arguments)
    console.log("Result ===>", result);

    client.set(key, JSON.stringify(result))

    return result

}


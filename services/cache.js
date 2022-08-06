const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.exec = function () {
    console.log("I am ran before the actual query executed")

    return exec.apply(this, arguments)
}


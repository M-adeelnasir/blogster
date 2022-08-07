const Buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey])


module.exports = (user) => {

    const session = {
        passport: {
            user: user._id.toString()
        }
    }
    const sessionString = Buffer.from(JSON.stringify(session)).toString('base64')
    const sig = keygrip.sign('session=' + sessionString)

    return { session, sig }

}
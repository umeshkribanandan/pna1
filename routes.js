const handlers = require('./handlers');

var router = {
    'ping': handlers.ping,
    'hello': handlers.hello
 }

module.exports = router;
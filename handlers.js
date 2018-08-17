var handlers = {};

handlers.ping = function(data, callback) {
   callback(200);
};

handlers.hello = function(data, callback) {
    callback(200,{'message':'Hello World'});
 };

handlers.notfound = function(data, callback) {
   callback(404,{});
};

module.exports = handlers;
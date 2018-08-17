var env = {};

env.staging = {
    'name' : 'staging',
    'port' : 3000,
    'httpsPort' : 3001
}

env.prod = {
    'name' : 'prod',
    'port' : 5000,
    'httpsPort' : 5001
}

var curEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';
var config = typeof(env[curEnv]) == 'object' ? env[curEnv] : env['staging'];

module.exports = config;

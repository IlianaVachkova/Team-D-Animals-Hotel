let path = require('path');
let rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/animalshotel',
        port: process.env.PORT || 3000
    }
};
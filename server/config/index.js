"use strict";

const path = require("path");
const rootPath = path.join(__dirname, "/../..");
console.log(rootPath);

const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const databaseConfig = require('./database-config')
const expressConfig = require('./express-config');
const passportConfig = require('./passport-config');
const router = require("../routers");
const controllers = require("../controllers");

module.exports = {
    port: process.env.PORT || config.port,
    rootPath: rootPath,
    setupConfigurations: function(app, rootPath) {
        //database
        databaseConfig.initializeConnection(config);

        //express
        expressConfig.initializeExpressViewEngine(app, rootPath);
        expressConfig.initializePublicFilesPath(app, rootPath);
        expressConfig.initializeMiddlewares(app);

        //passport
        passportConfig.initializeLocalStrategy();
        passportConfig.setSerializationProcedure();
        passportConfig.setDeserializationProcedure();

        //routers
        router.initializeRoutes(app, controllers);
    }
};
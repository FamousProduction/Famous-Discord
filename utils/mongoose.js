const mongoose = require('mongoose');

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };
        
        mongoose.connect('mongodb://hazze:famousbot@famousdb-shard-00-00-gpgqa.mongodb.net:27017,famousdb-shard-00-01-gpgqa.mongodb.net:27017,famousdb-shard-00-02-gpgqa.mongodb.net:27017/test?ssl=true&replicaSet=FamousDB-shard-0&authSource=admin&retryWrites=true&w=majority/famous', dbOptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connection successfully opened!');
        });
        
        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n ${err.stack}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose connection disconnected');
        });
    }
};

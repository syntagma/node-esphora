/*
var mongoose = require('mongoose');
var dbData = require('../../config/dbData');

exports.connect = function() {
    var uri = dbData.uri;//"mongodb://" + dbData.host + (dbData.port ? ":" + dbData.port : "") + "/" + dbData.dbName;

    var options = {
        db: { native_parser: dbData.nativeParser },
        server: { poolSize: dbData.poolSize },
        replset: { rs_name: dbData.replicasetName }
    };

    options.server.socketOptions =  { keepAlive: 1 };

    mongoose.connect(uri, options);

    if (dbData.debug) {
		mongoose.set('debug', dbData.debug);
	}
};

exports.closeConnection = function() {
    mongoose.connection.close();
};
*/
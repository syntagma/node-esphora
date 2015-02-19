/*
//var bunyan = require('bunyan');
var restify = require('restify');
var winston = require('winston');
var appData = require('../../config/appData');
var logentries = require('node-logentries');
var log = logentries.logger({
    token: appData.logentries
});

// Extend a winston by making it expand errors when passed in as the
// second argument (the first argument is the log level).
function expandErrors(logger) {
    var oldLogFunc = logger.log;
    logger.log = function() {
        var args = Array.prototype.slice.call(arguments, 0);
        if (args.length >= 2 && args[1] instanceof Error) {
            args[1] = args[1].stack;
        }
        return oldLogFunc.apply(this, args);
    };
    return logger;
}

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console,
    {
        timestamp: true,
        level: 'verbose',
        colorize: true,
        json: false,
        handleExceptions: false
    });

winston.exitOnError = false;
log.winston(winston);

module.exports.logger = expandErrors(winston);
*/

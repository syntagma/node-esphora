/*
"use strict";

var PassportConfigurator = require('./passportConfigurator');
//var sessions = require('../../controllers/sessions');

var HTTP_RESPONSE_CODE_UNAUTHORIZED = 401;
var ONE_HOUR = 60 * 60  * 1000;
var MAX_CACHE_SIZE = 10000;
var CACHE_TTL = ONE_HOUR;
var REMOVE_EXPIRED_SESSIONS_INTERVAL;
REMOVE_EXPIRED_SESSIONS_INTERVAL = ONE_HOUR;

var LRU = require("lru-cache");

function AuthSession(options) {
    var pc = new PassportConfigurator(options);

    this.passport = pc.passport;

    this.publicApiRegex = options.publicApi;
    this.panelApiRegex = options.panelApi;
    this.adminApiRegex = options.adminApi;

}


AuthSession.prototype.initialize = function(){
    return this.passport.initialize();
};


AuthSession.prototype.session = function() {
    var self = this;
    var cache = LRU({max: MAX_CACHE_SIZE, maxAge: CACHE_TTL});

    return (function auth(req, res, next) {

        if(req.url.match(self.publicApiRegex)) {
            return (next());
        }

        var unauthorized = function(message) {
            res.statusCode = HTTP_RESPONSE_CODE_UNAUTHORIZED;
            res.send(message);
            //next();
        };

        var authorize = function (sessionDocument) {
            if (req.url.match(self.adminApiRegex) && req.user && req.user.userType != "admin")
                return (unauthorized({ message : "not enough privileges"}));

            if (req.url.match(self.panelApiRegex) && req.user && (req.user.userType == "user"))
                return (unauthorized({ message : "not enough privileges"}));

            return (next(sessionDocument));
        };

        if (!req.isAuthenticated()) {
            return (unauthorized({ message : "not logged in"}));
        }
        return (authorize(req.session));
    });
};

AuthSession.prototype.logout = function(){
    var self = this;
    return function logout(req, res, next) {
        var cookieId = self.findCookieSessionId(req);
        if(cookieId) {
            sessions.removeSessionByCookieId(cookieId);
            req.logOut();
        }
        next();
    };
};


module.exports = AuthSession;
    */
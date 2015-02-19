"use strict";
var fbData = require('../../../config/facebookData');
var appData = require('../../../config/appData.js');
var url = require('url');
var logger = require('winston');

module.exports = function(app) {
    var passport;

    function facebookSignIn(req, res, next) {
        passport = req._passport.instance;

        req.session.clientUrl = null;
        if (req.params['redirect_uri']) {
            var redirectTo = req.params['redirect_uri'];
            if (redirectTo == "admin/application/users") {
                redirectTo = 'https://' + appData.clientHost + '/admin/#/' + redirectTo.substring(5, redirectTo.length);
                req.session.clientUrl = redirectTo;
            } else {
                if (redirectTo.indexOf(".com") >= 0) {

                    var parseUrl = url.parse(redirectTo, true);

                    req.session.clientUrl = (parseUrl.hostname === null) ? ((parseUrl.pathname.indexOf("/") >= 0) ?
                        parseUrl.protocol + "//" + parseUrl.pathname.substring(1, parseUrl.pathname.length) : parseUrl.pathname) : parseUrl.href;
                } else {
                    req.session.clientUrl = 'https://' + appData.clientHost + '/#/' + redirectTo;
                }
            }
        }
        logger.info("req.session.clientUrl: " + req.session.clientUrl);
        passport.authorize('facebook', {
            scope: ['email', 'user_birthday', 'read_stream', 'publish_actions']
        }, function(err, user, info) {

            logger.info("Facebook authorized: " + req.session.clientUrl);

        })(req, res, next);

    };

    function facebookSignInCallback(req, res, next) {
        passport = req._passport.instance;
        passport.authenticate('facebook', {
            scope: ['email', 'user_birthday', 'read_stream', 'publish_actions']
        }, function(err, user, info) {
            if (err) {
                try {
                    res.header('Location', (req.session.clientUrl) ? req.session.clientUrl : 'https://' + appData.clientHost + "/#/");
                    //res.write(err);
                    res.send(302, err);
                    res.end();
                    return;
                } catch (err) {
                    logger.error("Error facebookSignInCallback. Description: " + err);
                    return;

                }
            }
            logger.info("facebookSignInCallback: "+ JSON.stringify(user));
            if (!user) {
                try {
                    res.writeHead(302, {
                        'Location': 'https://' + appData.clientHost //token=' + usr.token + '&user=' + usr.email
                    });
                    res.end();
                    return;
                } catch (err) {
                    logger.error("Error facebookSignInCallback. Description: " + err);
                    return;

                }
            }

            req.logIn(user, function(err) {
                try {
                    if (err) {
                        logger.error("Error facebookSignInCallback: req.logIn. Description: " + err);
                        return next(err);
                    }
                } catch (err) {
                    logger.error("Error facebookSignInCallback: req.logIn. Description: " + err);
                    return;

                }
            });

            try {
                res.header('Location', (req.session.clientUrl) ? req.session.clientUrl : 'https://' + appData.clientHost + "/#/");
                res.send(302);

                res.end();
            } catch (err) {
                logger.error("Error: facebookSignInCallback. Description: " + err);
                return;

            }
        })(req, res, next);
    };

    function facebookSignInToken(req, res, next) {
        passport = req._passport.instance;
        passport.authenticate('facebook-token', {
            scope: ['email', 'user_birthday', 'read_stream', 'publish_actions']
        }, function(err, user, info) {
            logger.info("Err:" + JSON.stringify(err));
            logger.info("User:" + JSON.stringify(user));
            logger.info("Info: " + JSON.stringify(info));

            if (!user) {
                logger.warn("Error facebookSignInToken: not exist user");
                res.send(401);
                res.end();
                return;
            }

            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error facebookSignInToken: req.logIn . Description: " + err);
                    return next(err);
                }
            });

            res.send(200, user);
            res.end();
        })(req, res, next);
    };

    app.post(fbData.FB_VERIFY_TOKEN_PATH, facebookSignInToken);
    app.get(fbData.FB_LOGIN_PATH, facebookSignIn);
    app.get(fbData.FB_CALLBACK_PATH, facebookSignInCallback);
    app.get("/api/secure/logout",
        function(req, res, done) {
            req.logout();
            req.session.destroy();
            res.send(200);
            res.end();
            done(null);
        }
    );
};
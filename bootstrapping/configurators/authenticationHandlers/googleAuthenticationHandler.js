"use strict";
var passport = require('passport');
var UserDB = require('../../../schemas/wagaUser.js').wagaUserSchema;
var googleData = require('../../../config/googleData');


module.exports = function (app) {
    var passport;

    function googleSignIn(req, res, next) {
        passport = req._passport.instance;

        passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/userinfo.email'}, function (err, user, info) {

        })(req, res, next);

    };

    function googleSignInCallback(req, res, next) {
        passport = req._passport.instance;
        passport.authenticate('google', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('http://localhost:8000');
            }
            UserDB.findOne({email: user._json.email}, function (err, usr) {
                res.writeHead(302, {
                    'Location': 'http://localhost:8000/#/index?token=' + usr.token + '&user=' + usr.email
                });
                res.end();
            });
        })(req, res, next);
    };

    app.get(googleData.LOGIN_PATH, googleSignIn);
    app.get(googleData.CALLBACK_PATH, googleSignInCallback);


}

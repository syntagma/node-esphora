"use strict";

var passport = require('passport');


module.exports = function(app) {
    function localSignIn(req, res, next) {
        console.log("login local");
        passport = req._passport.instance;
        passport.authenticate('wagabasic')(req, res, next);
    }

    function localSignInCallback(req, res, next) {

    }

    app.post("/api/public/login/local", localSignIn, function(req, res) {
        res.json(req.user);
    });
    app.get("/api/public/login/local/callback", localSignInCallback);
};

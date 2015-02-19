"use strict";

var passport = require('passport');
var UserDB = require('../../models/wagaUser.js').WagaUser;
var appData = require('../../config/appData.js');
var fbData = require('../../config/facebookData');
var mixPanelData = require('../../config/mixPanelData');
var googleData = require('../../config/googleData');
var users = require('../../controllers/users.js');

var google_strategy = require('passport-google-oauth').OAuth2Strategy;
var facebook_strategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;

var logger = require('winston');

// grab the Mixpanel factory
var Mixpanel = require('mixpanel');

// create an instance of the mixpanel client
var mixpanel = Mixpanel.init(mixPanelData.TOKEN);
mixpanel.set_config({
    debug: mixPanelData.DEBUG
});

var util = require('util');

module.exports = function(options) {
    this.passport = passport;

    passport.serializeUser(function(user, done) {
        console.log("serialize");
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {

        console.log("deserialize");
        UserDB.findById(
            id, function(err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    console.log('passport deserialize: - user not found');
                    return done(err, user);
                }
                return done(err, user);

            });
    });

    passport.use(new google_strategy({
            clientID: googleData.APPID,
            clientSecret: googleData.APPSECRET,
            callbackURL: appData.server + ":" + appData.httpsPort + googleData.CALLBACK_PATH,
            passReqToCallback: true
        },
        function(accessToken, refreshToken, profile, done) {
            UserDB.findOne({
                email: profile._json.email
            }, function(err, usr) {
                usr.token = accessToken;
                usr.save(function(err, usr, num) {
                    if (err) {
                        console.log('error saving token');
                    }
                });
                process.nextTick(function() {
                    return done(null, profile);
                });
            });
        }
    ));

    var WagaBasicStrategy = function(options, verify) {
        if (typeof options == 'function') {
            verify = options;
            options = {};
        }
        if (!verify) throw new Error('HTTP Basic authentication strategy requires a verify function');

        passport.Strategy.call(this);
        this.name = 'wagabasic';
        this._verify = verify;
        this._realm = options.realm || 'Users';
        this._passReqToCallback = options.passReqToCallback;
    };

    util.inherits(WagaBasicStrategy, BasicStrategy);

    WagaBasicStrategy.prototype._challenge = function() {
        console.log("**** WagaBasicStrategy.prototype._challenge = 401");
        return 401;
    }


    passport.use(new WagaBasicStrategy({
        passReqToCallback: true
    }, function(req, username, password, done) {
        logger.info("User in Basic strategy");
        localCallbackHandler(req, username, password, done);

    }));

    passport.use(new facebook_strategy({
            clientID: fbData.FB_APPID,
            clientSecret: fbData.FB_APPSECRET,
            callbackURL: appData.server + ":" + appData.httpsPort + fbData.FB_CALLBACK_PATH,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {

            req.session.accessToken = accessToken;


            if (!req.user) {
                var queryUser = {
                    auths: {
                        $elemMatch: {
                            "profile.id": profile.id,
                            'provider': 'facebook'
                        }
                    }
                };

                UserDB.findOne(queryUser, function(err, user) {
                    if (err) {
                        return done(err)
                    }
                    if (!user) {

                        UserDB.findOne({
                            $or: [{
                                'publicName': profile.username
                            }, {
                                'email': profile._json.email
                            }]
                        }, function(err, preExistentUser) {
                            if (err) {
                                return done(err)
                            }
                            if (!preExistentUser) {
                                users.createFacebookUser(profile, function(err, newUser) {
                                    if (err) {
                                        return done(err)
                                    }

                                    var dataFB = {
                                        'accessToken': accessToken
                                    };
                                    users.updatePortrait(newUser._id, 'facebook', dataFB, function(err, updateUser) {
                                        if (!err) {
                                            users.sendMailWelcome(updateUser);
                                            done(err, newUser);
                                            return;
                                        }
                                    });
                                })
                            } else { //username already in dbs
                                //Same Mail
                                if (preExistentUser.email == profile._json.email) {

                                    preExistentUser.auths.forEach(function(auth) {
                                        if (auth.provider == 'facebook') {
                                            auth.profile = profile._json;
                                            return;
                                        }
                                    });


                                    users.updateProfile(req, preExistentUser, accessToken, function(err, newUser) {
                                        if (err) {
                                            logger.warn("Error users.updateProfile. Description: " + err);
                                            return done(err)
                                        }
                                        return done(err, newUser);
                                    })
                                } else {
                                    //Same Public Name
                                    users.generatePublicName(profile.username, function(err, newPublicName) {
                                        profile.username = newPublicName;
                                        users.createFacebookUser(profile, function(err, newUser) {
                                            if (err) {
                                                logger.warn("Error users.createFacebookUser. Description: " + err);
                                                return done(err)
                                            }

                                            return done(err, newUser);
                                        })

                                    })
                                }

                            }
                        })
                    } else {

                        users.updatePortrait(user._id, "facebook", {
                            accessToken: accessToken
                        }, function(err, updatedUser) {
                            return done(err, updatedUser);
                        })
                    }
                });
            } /*Modificar a partit ¿r de aca*/
            else {
                logger.info("Modificar a partit  de aca")
                UserDB.findOne({
                    _id: req.user._id
                }, function(err, user) {
                    if (err) {
                        logger.warn("Error UserDB.findOne. Description: " + err);
                        return done(err)
                    }
                    if (!user) {
                        logger.warn("Not exist user. Description: " + err);
                        return done(err, req.user);
                    } else {

                        var profileFacebook = false;
                        logger.info("Va por aca?");

                        user.auths.forEach(function(auth) {
                            if (auth.provider == 'facebook' && auth.profile.id == profile.id) {
                                auth.profile = profile._json;
                                profileFacebook = true;

                                user.save(function(err, user) {
                                    if (err) {
                                        logger.error("Error facebook_strategy: user.save. Description: " + err);
                                        done(err);
                                        return;
                                    }

                                    done(null, user);
                                });
                            }
                        });

                        if (!profileFacebook) {

                            var queryUser = {
                                auths: {
                                    $elemMatch: {
                                        "profile.id": profile.id,
                                        'provider': 'facebook'
                                    }
                                }
                            };

                            UserDB.findOne(queryUser, function(err, userDTO) {
                                if (err) {
                                    logger.error("Error facebook_strategy: UserDB.findOne. Description: " + err);
                                    return done(err)
                                }
                                if (!userDTO) {
                                    user.auths.push({
                                        'provider': 'facebook',
                                        'profile': profile._json
                                    });

                                    user.save(function(err, user) {
                                        if (err) {
                                            logger.error("Error facebook_strategy: user.save. Description: " + err);
                                            done(err);
                                            return;
                                        }
                                        /*
                                        mixpanel.track("Link",{
                                            "Register Type": "Facebook",
                                            "distinct_id": user._id
                                        });

                                        mixpanel.people.set({
                                            "Facebook Connected": true,
                                            "$email": user.email
                                        });
                                        */
                                        done(null, user);
                                    });

                                } else {
                                    logger.error("Another user is already linked with this Facebook profile.");
                                    done(new Error("Another user is already linked with this Facebook profile."));
                                    return;
                                }

                            });
                        }

                    }

                });
            }
        }
    ));

    passport.use(new FacebookTokenStrategy({
            clientID: fbData.FB_APPID,
            clientSecret: fbData.FB_APPSECRET,
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            req.session.accessToken = accessToken;

            if (!req.user) {
                var queryUser = {
                    auths: {
                        $elemMatch: {
                            "profile.id": profile.id,
                            'provider': 'facebook'
                        }
                    }
                };

                UserDB.findOne(queryUser, function(err, user) {
                    if (err) {
                        return done(err)
                    }
                    if (!user) {
                        UserDB.findOne({
                            $or: [{
                                'publicName': profile.username
                            }, {
                                'email': profile._json.email
                            }]
                        }, function(err, preExistentUser) {
                            if (err) {
                                return done(err)
                            }
                            if (!preExistentUser) {
                                users.createFacebookUser(profile, function(err, newUser) {
                                    if (err) {
                                        return done(err)
                                    }
                                    var dataFB = {
                                        'accessToken': accessToken
                                    };
                                    /*
                                    mixpanel.track("Register",{
                                        "Register Type": "Facebook",
                                        "Platform": "Mobile App",
                                        "distinct_id": newUser._id
                                    });

                                    mixpanel.people.set({
                                        "First Login Complete": false,
                                        "Facebook Connected": true,
                                        "$email": newUser.email,
                                        "$created": new Date()
                                    });
                                    */

                                    done(err, newUser);
                                    users.updatePortrait(newUser._id, 'facebook', dataFB, function(err, updateUser) {
                                        if (!err) {
                                            users.sendMailWelcome(updateUser);
                                            return;
                                        }
                                    });
                                })
                            } else { //username already in dbs
                                //Same Mail
                                if (preExistentUser.email == profile._json.email) {

                                    preExistentUser.auths.forEach(function(auth) {
                                        if (auth.provider == 'facebook') {
                                            auth.profile = profile._json;
                                            return;
                                        }
                                    });
                                    users.updateProfile(req, preExistentUser, accessToken, function(err, newUser) {
                                        if (err) {
                                            console.log("Error updating user: " + err);
                                            return done(err)
                                        }
                                        return done(err, newUser);
                                    })
                                } else {
                                    //Same Public Name
                                    users.generatePublicName(profile.username, function(err, newPublicName) {
                                        profile.username = newPublicName;
                                        users.createFacebookUser(profile, function(err, newUser) {
                                            /*
                                            mixpanel.track("Register",{
                                                "Register Type": "Facebook",
                                                "Platform": "Mobile App",
                                                "distinct_id": newUser._id
                                            });

                                            mixpanel.people.set({
                                                "Facebook Connected": true,
                                                "$email": newUser.email,
                                                "$created": new Date()
                                            });
                                            */


                                            if (err) {
                                                return done(err)
                                            }
                                            return done(err, newUser);
                                        })

                                    })
                                }

                            }
                        })
                    } else {
                        /*
                        mixpanel.track("Login",{
                            "Register Type": "Facebook",
                            "Platform": "Mobile App",
                            "distinct_id": user._id
                        });

                        mixpanel.people.set({
                            "Facebook Connected": true,
                            "$email": user.email
                        });
                        */

                        users.updatePortrait(user._id, "facebook", {
                            accessToken: accessToken
                        }, function(err, updatedUser) {
                            return done(err, updatedUser);
                        })
                    }
                });
            } //!req.user
            else {
                UserDB.findOne({
                    _id: req.user._id
                }, function(err, user) {
                    if (err) {
                        return done(err)
                    }
                    if (!user) {
                        return done(err, req.user);
                    } else {
                        user.auths.forEach(function(auth) {
                            if (auth.provider == 'facebook' && auth.profile.id == profile.id) {
                                done(null, user);
                                //return;
                            } else {
                                done(new Error("Already logged in with a different account."));
                                //return;
                            }
                        });

                    }

                });
            }
        }
    ));


    /************************************************************************/


    var localCallbackHandler = function(req, username, password, done) {
        var errorWrapper = function(errorObj) {
            if (errorObj) {
                console.log("errorWrapper: " + JSON.stringify(errorObj));
                return done(errorObj);
            }
            console.log("errorWrappe: Username or password is not correct ");
            return done(null, false, {
                message: "Username or password is not correct"
            });


        };

        var successWrapper = function(userDocument) {
            console.log("successWrapper");
            return done(null, userDocument);
        };

        if (req.params && req.params['signup']) {
            console.log("req.params['signup'] = " + req.params['signup']);
            users.createLocalUserByEmailAndPassword({
                username: username,
                password: password
            }, function(err, user) {
                if (err || !user) {
                    console.log("createLocalUserByEmailAndPassword err =" + err);
                    errorWrapper(err);
                    //return;
                } else {
                    // Descomentar envio de mail
                    users.sendMailWelcomeAndVerificationByCode(user);
                    successWrapper(user);
                }
            });
        } else {
            users.findUserByUsernameAndPassword({
                username: username,
                password: password
            }, function(err, user) {
                if (err || !user) {
                    console.log("Error finding User: " + err);
                    return errorWrapper(err);
                }
                successWrapper(user);
            });
        }
    };


    module.exports = {
        passport: this.passport
    };
};
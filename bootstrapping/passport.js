
const passport = require( "passport" ),
    BasicStrategy = require( "passport-http" ).BasicStrategy,
    authorizationService = require( "../services/authorizationService" );

    /*
passport.use( "user", new BasicStrategy(
    ( username, password, done ) => {
        "use strict";

        authorizationService.validateUser( username, password, ( err, usuario ) => {

            if ( err ) {
                log.error( "USER: " + err );
            }
            if ( usuario ) {
                done( null, true );
            } else {
                done( null, false, { "message": err } );
            }
        } );
    }
) );

passport.use( "admin", new BasicStrategy(
    ( username, password, done ) => {
        "use strict";

        authorizationService.validateAdminUser( username, password, ( err, usuario ) => {

            if ( err ) {
                log.error( "ADMIN: " + err );
            }
            if ( usuario ) {
                done( null, true );
            } else {
                done( null, false, { "message": err } );
            }
        } );
    }
) );

passport.use( "company", new BasicStrategy(
    ( username, password, done ) => {
        "use strict";

        authorizationService.validateCompanyUser( username, password, ( err, usuario ) => {

            if ( err ) {
                log.error( "COMPANY: " + err );
            }
            if ( usuario ) {
                done( null, true );
            } else {
                done( null, false, { "message": err } );
            }
        } );
    }
) );

passport.use( "shared", new BasicStrategy(
    ( username, password, done ) => {
        "use strict";

        authorizationService.validateAdminCompanyUser( username, password, ( err, usuario ) => {

            if ( err ) {
                log.error( "SHARED: " + err );
            }
            if ( usuario ) {
                done( null, true );
            } else {
                done( null, false, { "message": err } );
            }
        } );
    }
) );
*/
passport.use( "public", new BasicStrategy(
    ( username, password, done ) => {
        "use strict";

        authorizationService.validatePublicUser( username, password, ( err, usuario ) => {

            if ( err ) {
                log.error( "PUBLIC: " + err );
            }
            if ( usuario ) {
                done( null, true );
            } else {
                done( null, false, { "message": err } );
            }
        } );
    }
) );

module.exports = passport;


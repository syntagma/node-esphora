let //UsuarioController = require( "../controllers/usuarioController" ),
    restify = require( "restify" ),
    authUsers = {
        "ANONYMOUS": {
            "username": "anonymous",
            "password": "5023301bed209d9515d835bdb6415252"
        }
    },
    mensajes = {
        "MISSING_AUTH": "Falta envío de Autorización en Headers.",
        "INVALID_USER": "El usuario no es válido.",
        "UNAUTH_USER": "El usuario no esta autorizado para realizar esta acción.",
        "INVALID_USER_PASS": "El nombre de usuario y/o la contraseña no son válidos",
        "BLOCKED_USER": "El usuario se encuentra deshabilitado",
        "INSUFFICIENT_PERMISSION": "El usuario no tiene los permisos necesarios para utilizar esta función"
    };
/*
exports.validateUser = function( username, password, callback ) {
    "use strict";

    if ( !username || !password || username === authUsers.ANONYMOUS.username ) {
        return callback( mensajes.UNAUTH_USER );
    }

    UsuarioController.findByEmail( username, true, ( err, usuario ) => {
        if ( err ) {
            return callback( err );
        }
    
        if ( !hasRole( usuario.roles, ROLES.USER ) ) {
            return callback( mensajes.INSUFFICIENT_PERMISSION );
        }

        if ( !usuario.habilitado ) {

            return callback( mensajes.BLOCKED_USER );
        }
            
        if ( username === usuario.email && password === usuario.password ) {
            callback( null, usuario );
        } else {
            callback( mensajes.INVALID_USER_PASS );
        }
    } );
};
exports.validateAdminUser = function( username, password, callback ) {
    "use strict";

    this.validateUser( username, password, ( err, user ) => {
    
        if ( err ) {
            return callback( err );
        }
        if ( !isAdmin( user ) ) {
            return callback( mensajes.UNAUTH_USER );
        }

        return callback( null, user );

    } );

};

exports.validateCompanyUser = function( username, password, callback ) {
    "use strict";

    this.validateUser( username, password, ( err, user ) => {
    
        if ( err ) {
            return callback( err );
        }
        if ( !isCompany( user ) ) {
            return callback( mensajes.UNAUTH_USER );
        }

        return callback( null, user );

    } );

};

exports.validateAdminCompanyUser = function( username, password, callback ) {
    "use strict";

    this.validateUser( username, password, ( err, user ) => {
    
        if ( err ) {
            return callback( err );
        }
        if ( !isAdmin( user ) && !isCompany( user ) ) {
            return callback( mensajes.UNAUTH_USER );
        }

        return callback( null, user );

    } );

};
*/
exports.validatePublicUser = function( username, password, callback ) {
    "use strict";

    if ( authUsers.ANONYMOUS.username === username ) {
        if ( authUsers.ANONYMOUS.password !== password ) {
            return callback( new restify.NotAuthorizedError( mensajes.INVALID_USER_PASS ) );
        }
        
    } else {
        return callback( new restify.NotAuthorizedError( err ) );
    }

    return callback( null, true );

};

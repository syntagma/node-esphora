let RestifyRouter = require( "restify-routing" ),
    errors = require( "restify-errors" ),
    subRouter = new RestifyRouter(),
    invoiceController = require( "../controllers/invoices" );
    
subRouter.get( "/test", ( req, res, next ) => {
    "use strict";
    
    invoiceController.dummy( ( err, response ) => {
        if ( err ) {
            log.error( "FEDummy falló: " + err );
            return next( new errors.ConflictError( err ) );
        }

        res.send( response );
        next();
    } );
} );

subRouter.get( "/user", ( req, res, next ) => {
    "use strict";
    res.setHeader( "Content-Type", "application/json");
    res.send( req.session );
    next( );
} );

subRouter.get( "/invoices/:companyId/find/:pos/:type/:number", ( req, res, next ) => {
    "use strict";

    invoiceController.compConsultar( req.params.companyId, req.params.pos, req.params.type, req.params.number, ( err, response ) => {
        if ( err ) {
            log.error( "compConsultar falló: " + err );
            log.debug( "compConsultar +++++" );
            // return next( new errors.InternalError( err, { "content-type": "application/json; charset=utf-8" } ) );
            return next( new errors.ConflictError( err ) );
        }

        res.send( response );
        next();
    } );
} );

subRouter.get( "/invoices/:companyId/find/:pos/:type", ( req, res, next ) => {
    "use strict";

    invoiceController.compUltimoAutorizado( req.params.companyId, req.params.pos, req.params.type, ( err, response ) => {
        if ( err ) {
            log.error( "finInvoice falló: " + err );
            log.debug( "findInvoices +++++" );
            // return next( new errors.InternalError( err, { "content-type": "application/json; charset=utf-8" } ) );
            return next( new errors.ConflictError( err ) );
        }

        res.send( response );
        next();
    } );
} );

module.exports = subRouter;
